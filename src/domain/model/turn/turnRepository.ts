import mysql from "mysql2/promise";
import { Turn } from "./turn";
import { SquareGateway } from "../../../infrastructure/squareGateway";
import { TurnGateway } from "../../../infrastructure/turnGateway";
import { MoveGateway } from "../../../infrastructure/moveGateway";
import { Move } from "./move";
import { toDisc } from "./disc";
import { Point } from "./point";
import { Board } from "./board";
import { DomainError } from "../../error/domainError";

const squareGateway = new SquareGateway();
const moveGateway = new MoveGateway();
const turnGateway = new TurnGateway();

export class TurnRepository {
  async findForGameIdAndTurnCount(
    conn: mysql.Connection,
    gameId: number,
    turnCount: number
  ): Promise<Turn> {
    const turnRecord = await turnGateway.findForGameIdAndTurnCount(
      conn,
      gameId,
      turnCount
    );
    if (!turnRecord) {
      throw new DomainError(
        "SpecifiedTurnNotFound",
        "Specified turn not found"
      );
    }

    const squareRecords = await squareGateway.findForTurnId(
      conn,
      turnRecord.id
    );
    const board = Array.from(Array(8)).map(() => Array.from(Array(8)));
    squareRecords.forEach((s: any) => {
      board[s.y][s.x] = s.disc;
    });

    const moveRecord = await moveGateway.findForTurnId(conn, turnRecord.id);
    let move: Move | undefined;

    if (moveRecord) {
      move = new Move(
        toDisc(moveRecord.disc),
        new Point(moveRecord.x, moveRecord.y)
      );
    }

    const next_disc =
      turnRecord.nextDisc === null ? undefined : toDisc(turnRecord.nextDisc);
    return new Turn(
      gameId,
      turnCount,
      next_disc,
      move,
      new Board(board),
      turnRecord.endAt
    );
  }

  async save(conn: mysql.Connection, turn: Turn) {
    const turnRecord = await turnGateway.insert(
      conn,
      turn.gameId,
      turn.turnCount,
      turn.nextDisc,
      turn.endAt
    );
    await squareGateway.insertAll(conn, turnRecord.id, turn.board.discs);

    if (turn.move) {
      await moveGateway.insert(
        conn,
        turnRecord.id,
        turn.move.disc,
        turn.move.point.x,
        turn.move.point.y
      );
    }
  }
}

import { WinnerDisc } from "./winnerDisc";

export class GameResult {
  constructor(
    private _gameId: number,
    private _winnerDisc: WinnerDisc,
    private _endAt: Date
  ) {}

  get gameId() {
    return this._gameId;
  }

  get endAt() {
    return this._endAt;
  }

  get winnerDisc() {
    return this._winnerDisc;
  }
}

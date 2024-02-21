type DomeinerrorType =
  | "SelectedPointIdNotEmpty"
  | "FlipPointsIsEmpty"
  | "SelectedDiscIsNotNextDisc"
  | "PreviousTurnNotFound";
export class DomeinError extends Error {
  constructor(private _type: DomeinerrorType, message: string) {
    super(message);
  }

  get type() {
    return this._type;
  }
}

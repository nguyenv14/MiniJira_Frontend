export enum Positions {
  PM = 1,
  Developer = 2,
  Tester = 3,
  Designer = 4,
  Commtor = 5,
  PQA = 6
}

export function getPositionDescription(positions: Positions): string {
  switch (positions) {
    case Positions.Developer:
      return 'Developer';
    case Positions.Tester:
      return 'Tester';
    case Positions.PM:
      return 'Project Manager';
    case Positions.Designer:
      return 'Project Manager';
    case Positions.Commtor:
      return 'Project Manager';
    case Positions.PQA:
      return 'Project Quality Access';
    default:
      return 'Default';
  }
}
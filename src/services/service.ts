import {buildCellConstraint, getNeighbourCells, getOpenBorderCells, isClosedCell} from '../utils';
import {Cell, CellWithConstraint, Position, Constraint} from '../types'
import {isEqual, uniqWith} from 'lodash';

export function nextMoves(cells: Cell[][], flags: boolean[][]) {
  console.log('Finding next moves');
  const toFlag: Position[] = [];
  const toOpen: Position[] = [];
  getOpenBorderCells(cells).forEach(c => {
    const cellsNearby = getNeighbourCells(cells, c);
    const closedNearby = cellsNearby.filter(c => isClosedCell(c.content));

    if (closedNearby.length === 0) {
      return;
    }

    const bombsAround = Number(c.content);
    let flaggedNearby = cellsNearby.filter(c => flags[c.y][c.x]).length;

    if (closedNearby.length - flaggedNearby === bombsAround - flaggedNearby && closedNearby.length - flaggedNearby > 0) {
      closedNearby
        .filter(c => !flags[c.y][c.x])
        .forEach(c => {
          toFlag.push(c);
          flaggedNearby++;
        });
      console.log('Set flag');
    }

    if (bombsAround - flaggedNearby === 0 && closedNearby.length - flaggedNearby > 0) {
      closedNearby
        .filter(c => !flags[c.y][c.x])
        .forEach(c => toOpen.push(c));
      console.log('Set to open');
    }
  });

  if (toFlag.length === 0 && toOpen.length === 0) {
    return null;
  }

  return {
    toFlag,
    toOpen
  };
}

class ConstraintGroup {
  constraints: Set<Constraint> = new Set<Constraint>();

  addConstraint(constraint: Constraint) {
    this.constraints.add(constraint);
  }

  intersects(coordinate: Position): boolean {
    return Array.from(this.constraints).find(c =>
      c.findIndex(coordinate) !== -1
    ) != null;
  }

  suits(coordinate: Position[]): boolean {
    return Array.from(this.constraints).find(c => !c.suitsConstraint(coordinate)) == null;
  }
}

function buildGroup(cells: Cell[][], flags: boolean[][], c: Cell, groups: ConstraintGroup[]) {
  const constrainingCells = getNeighbourCells(cells, c)
    .filter(c => !isClosedCell(c.content))
    .map((c): CellWithConstraint | null => {
      const constraint = buildCellConstraint(cells, flags, c);
      if (constraint == null) {
        return null;
      }
      return {
      ...c,
        constraint
      }
    })
    .filter((c): c is CellWithConstraint => c != null);

  const constraints = constrainingCells.map(c => c.constraint).filter((c): c is Constraint => c != null);

  let group: ConstraintGroup | undefined;
  if (groups.length === 0) {
    group = new ConstraintGroup();
    groups.push(group);
  } else {
    group = groups.find(g =>
      constraints.find(c => c.possibleBombPlacements.find((p: Position) => g.intersects(p)))
    );

    if (!group) {
      group = new ConstraintGroup();
      groups.push(group);
    }
  }

  if (group) {
    constraints.forEach(c => group!.addConstraint(c));
  }
}

function check(g: ConstraintGroup, coordinates: Position[]) {
  const foundMatches: Position[][] = [];

  const f = function (toCheck: Position[], checked: Position[]) {
    for (let i = 0; i < toCheck.length; i++) {
      const tempResult = [...checked, toCheck[i]];
      if (g.suits(tempResult)) {
        console.log('Found match', tempResult);
        foundMatches.push(tempResult);
      }
      f(toCheck.slice(i + 1), tempResult);
    }
  };
  f(coordinates, []);

  return uniqWith(foundMatches, isEqual);
}

export function deduce(cells: Cell[][], flags: boolean[][]) {
  console.log('Deducing next moves');
  const closedBorderCells: Set<Cell> = new Set(getOpenBorderCells(cells)
    .flatMap(c => getNeighbourCells(cells, c).filter(c => isClosedCell(c.content) && !flags[c.y][c.x]))
  );

  const groups: ConstraintGroup[] = [];
  closedBorderCells.forEach(c => buildGroup(cells, flags, c, groups));
  console.log(groups);

  const toOpen: Position[] = [];
  const toFlag: Position[] = [];

  for (const g of groups) {
    const pbc = uniqWith(Array.from(g.constraints)
      .flatMap(c => c.possibleBombPlacements), isEqual);

    // cut off large closed groups to speed up computation
    if (pbc.length > 15) {
      continue;
    }

    console.log(pbc);

    const positiveTests = check(g, pbc)
      .filter(c => g.suits(c));

    console.log(positiveTests);

    if (positiveTests.length === 1) {
      positiveTests[0].forEach(c => toFlag.push(c));
    } else if (positiveTests.length > 1) {
      const array = positiveTests.flatMap(p => p);
      pbc
        .filter(c => !array.includes(c))
        .forEach(cc => toOpen.push(cc));
    }
  }

  if (toFlag.length === 0 && toOpen.length === 0) {
    return null;
  }

  return {
    toFlag,
    toOpen
  };
}
import {deduce, nextMoves} from './service';
import {genMap} from './map';

describe('service', () => {

  it('scen 1', () => {
    const map = genMap('map:\n' +
      '1□\n' +
      '11\n');
    nextMoves(map);

    expect(map.isFlaggedByPos(1, 0)).toBeTruthy();
  });

  it('scen 2', () => {
    const map = genMap('map:\n' +
      '□□□□□\n' +
      '11122\n');
    nextMoves(map);

    expect(map.isFlaggedByPos(3, 0)).toBeTruthy();
    expect(map.isFlaggedByPos(4, 0)).toBeTruthy();

    nextMoves(map);

    expect(map.cells[0][2].isToOpen()).toBeTruthy();
  });

  it('scen 3', () => {
    const map = genMap('map:\n' +
      '1□\n' +
      '2□\n' +
      '1□\n');
    map.setFlagByPos(1, 0, true);
    map.setFlagByPos(1, 2, true);
    nextMoves(map);

    expect(map.cells[1][1].isToOpen()).toBeTruthy();
  });

  it('scen 4', () => {
    const map = genMap('map:\n' +
      '□00\n' +
      '010\n' +
      '00□\n');
    map.setFlagByPos(2, 2, true);
    nextMoves(map);

    expect(map.cells[0][0].isToOpen()).toBeTruthy();
  });

  it('scen 5', () => {
    const map = genMap('map:\n' +
      '□1\n' +
      '□2\n' +
      '□1\n');
    map.setFlagByPos(0, 1, true);
    map.setFlagByPos(0, 2, true);
    nextMoves(map);

    expect(map.cells[0][0].isToOpen()).toBeTruthy();
  });

  it('scen 6', () => {
    const map = genMap('map:\n' +
      '□□□\n' +
      '□1□\n' +
      '□□□\n');
    map.setFlagByPos(0, 0, true);
    nextMoves(map);

    expect(map.cells[0][1].isToOpen()).toBeTruthy();
    expect(map.cells[0][2].isToOpen()).toBeTruthy();
    expect(map.cells[1][0].isToOpen()).toBeTruthy();
    expect(map.cells[1][2].isToOpen()).toBeTruthy();
    expect(map.cells[2][0].isToOpen()).toBeTruthy();
    expect(map.cells[2][1].isToOpen()).toBeTruthy();
    expect(map.cells[2][2].isToOpen()).toBeTruthy();
  });

  it('scen 7', () => {
    const map = genMap('map:\n' +
      '□2□\n' +
      '1□□\n' +
      '□□□\n');
    map.setFlagByPos(0, 0, true);
    nextMoves(map);

    expect(map.cells[0][2].isToOpen()).toBeFalsy();

    expect(map.cells[1][1].isToOpen()).toBeTruthy();
    expect(map.cells[2][0].isToOpen()).toBeTruthy();
    expect(map.cells[2][1].isToOpen()).toBeTruthy();
  });

  it('deduce 1', () => {
    const map = genMap('map:\n' +
      '□□\n' +
      '□3\n' +
      '□2\n' +
      '□1\n');
    map.setFlagByPos(0, 0, true);
    map.setFlagByPos(1, 0, true);

    expect(nextMoves(map)).toBeFalsy();
    deduce(map);

    expect(map.isFlaggedByPos(0, 1)).toBeTruthy();
    expect(map.isFlaggedByPos(0, 3)).toBeTruthy();
  });

  it('deduce 2', () => {
    const map = genMap('map:\n' +
      '□□□1\n' +
      '□□22\n' +
      '2□2□\n' +
      '1□21\n');
    map.setFlagByPos(0, 1, true);
    map.setFlagByPos(3, 2, true);

    deduce(map);

    expect(map.isFlaggedByPos(2, 0)).toBeTruthy();
    expect(map.isFlaggedByPos(1, 3)).toBeTruthy();
  });

});
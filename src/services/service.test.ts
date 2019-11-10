import {deduce, nextMoves} from './service';
import {parseMap} from '../utils';
import {getFlags} from '../testUtils';

describe('service', () => {

  it('scen 1', () => {
    const cells = parseMap('map:\n' +
      '1□\n' +
      '11\n');
    const result = nextMoves(cells, getFlags(cells));

    expect(result).toBeTruthy();
    expect(result!.toFlag).toContainEqual({
      x: 1,
      y: 0
    });
  });

  it('scen 2', () => {
    const cells = parseMap('map:\n' +
      '□□□□□\n' +
      '11122\n');
    const result = nextMoves(cells, getFlags(cells));

    expect(result).toBeTruthy();
    expect(result!.toFlag).toContainEqual({
      x: 3,
      y: 0
    });
    expect(result!.toFlag).toContainEqual({
      x: 4,
      y: 0
    });
  });

  it('scen 3', () => {
    const cells = parseMap('map:\n' +
      '1□\n' +
      '2□\n' +
      '1□\n');
    const flags = getFlags(cells);
    flags[0][1] = true;
    flags[2][1] = true;
    const result = nextMoves(cells, flags);

    expect(result).toBeTruthy();
    expect(result!.toOpen).toContainEqual({
      x: 1,
      y: 1
    });
  });

  it('scen 4', () => {
    const cells = parseMap('map:\n' +
      '□00\n' +
      '010\n' +
      '00□\n');
    const flags = getFlags(cells);
    flags[2][2] = true;
    const result = nextMoves(cells, flags);

    expect(result).toBeTruthy();
    expect(result!.toOpen).toContainEqual({
      x: 0,
      y: 0
    });
  });

  it('scen 5', () => {
    const cells = parseMap('map:\n' +
      '□1\n' +
      '□2\n' +
      '□1\n');
    const flags = getFlags(cells);
    flags[1][0] = true;
    flags[2][0] = true;
    const result = nextMoves(cells, flags);

    expect(result).toBeTruthy();
    expect(result!.toOpen).toContainEqual({
      x: 0,
      y: 0
    });
  });

  it('scen 6', () => {
    const cells = parseMap('map:\n' +
      '□□□\n' +
      '□1□\n' +
      '□□□\n');
    const flags = getFlags(cells);
    flags[0][0] = true;
    const result = nextMoves(cells, flags);

    expect(result).toBeTruthy();
    expect(result!.toOpen).toContainEqual({
      x: 1,
      y: 0
    });
    expect(result!.toOpen).toContainEqual({
      x: 2,
      y: 0
    });
    expect(result!.toOpen).toContainEqual({
      x: 0,
      y: 1
    });
    expect(result!.toOpen).toContainEqual({
      x: 2,
      y: 1
    });
    expect(result!.toOpen).toContainEqual({
      x: 0,
      y: 2
    });
    expect(result!.toOpen).toContainEqual({
      x: 1,
      y: 2
    });
    expect(result!.toOpen).toContainEqual({
      x: 2,
      y: 2
    });
  });

  it('scen 7', () => {
    const cells = parseMap('map:\n' +
      '□2□\n' +
      '1□□\n' +
      '□□□\n');
    const flags = getFlags(cells);
    flags[0][0] = true;
    const result = nextMoves(cells, flags);

    expect(result).toBeTruthy();
    expect(result!.toOpen).not.toContainEqual({
      x: 2,
      y: 0
    });

    expect(result!.toOpen).toContainEqual({
      x: 1,
      y: 1
    });
    expect(result!.toOpen).toContainEqual({
      x: 0,
      y: 2
    });
    expect(result!.toOpen).toContainEqual({
      x: 1,
      y: 2
    });
  });

  it('deduce 1', () => {
    const cells = parseMap('map:\n' +
      '□□\n' +
      '□3\n' +
      '□2\n' +
      '□1\n');
    const flags = getFlags(cells);
    flags[0][0] = true;
    flags[0][1] = true;
    expect(nextMoves(cells, flags)).toBeFalsy();
    const result = deduce(cells, flags);

    expect(result).toBeTruthy();
    expect(result!.toFlag).toContainEqual({
      x: 0,
      y: 1
    });
    expect(result!.toFlag).toContainEqual({
      x: 0,
      y: 3
    });
  });

  it('deduce 2', () => {
    const cells = parseMap('map:\n' +
      '□□□1\n' +
      '□□22\n' +
      '2□2□\n' +
      '1□21\n');
    const flags = getFlags(cells);
    flags[1][0] = true;
    flags[2][3] = true;
    const result = deduce(cells, flags);

    expect(result).toBeTruthy();

    expect(result!.toFlag).toContainEqual({
      x: 2,
      y: 0
    });
    expect(result!.toFlag).toContainEqual({
      x: 1,
      y: 3
    });
  });

});
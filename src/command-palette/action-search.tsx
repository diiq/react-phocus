import { ActionInContext } from "phocus/dist/action-context/action-context";

const Bonuses = {
  wordBoundary: 30,
  consecutiveLetters: 15,
  separation: -1,
  distanceFromFilename: -10,
  repeatedSelection: 10,
  recentSelection: 10
};
class Match<T> {
  matched = false;
  value: T;
  name: string;
  regex: RegExp;
  matchList: RegExpMatchArray | [] = [];
  parts: { match: string; index: number }[] = [];

  static search<T>(search: string, list: T[], key: (value: T) => string) {
    search = search.toLowerCase()
    const regex = new RegExp(`(.*?)(${search.split("").map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join(")(.*?)(")})(.*)`);
    let matches = Array.from(list).map(item => new Match(item, key, regex));
    matches = matches.filter(m => m.matched);
    matches.sort((a, b) => b.score() - a.score());
    return matches.map(m => m.value);
  }

  constructor(value: T, key: (value: T) => string, searchRegex: RegExp) {
    this.value = value;
    this.name = key(value);
    this.regex = searchRegex;
    if (!this.name) {
      this.matched = false;
      return;
    }
    const matchList = this.name.toLowerCase().match(searchRegex);
    if (!matchList) {
      this.matched = false;
      return;
    }
    this.matched = true;
    this.matchList = matchList.slice(1);
    this.parts = this.getParts();
  }

  totalLength() {
    return this.parts[this.parts.length - 1].index - this.parts[0].index + 1;
  }

  matchedLength() {
    return (this.matchList.length - 1) / 2;
  }

  getParts() {
    let ind = -1;
    const ret = (() => {
      const result = [];
      for (
        let i = 0, end = this.matchedLength(), asc = 0 <= end;
        asc ? i < end : i > end;
        asc ? i++ : i--
      ) {
        ind += this.matchList[i * 2].length + this.matchList[i * 2 + 1].length;
        result.push({
          match: this.matchList[i * 2 + 1],
          index: ind
        });
      }
      return result;
    })();
    return ret;
  }

  wordBoundaryBonus() {
    let bonus = 0;
    for (let part of Array.from(this.parts)) {
      if (
        part.index === 0 ||
        this.name[part.index - 1] === "-" ||
        this.name[part.index - 1] === " "
      ) {
        bonus += Bonuses.wordBoundary;
      }
    }
    return bonus;
  }

  separationBonus() {
    return (this.totalLength() - this.matchedLength()) * Bonuses.separation;
  }

  consecutiveLettersBonus() {
    let bonus = 0;
    for (
      let i = 1, end = this.parts.length, asc = 1 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      if (this.parts[i].index - this.parts[i - 1].index === 1) {
        bonus += Bonuses.consecutiveLetters;
      }
    }
    return bonus;
  }

  score() {
    return (
      this.separationBonus() +
      this.wordBoundaryBonus() +
      this.consecutiveLettersBonus()
    );
  }
}

export function filterActions(actions: ActionInContext[], search: string) {
  return Match.search(search, actions, (v: ActionInContext) => v.action.name);
}

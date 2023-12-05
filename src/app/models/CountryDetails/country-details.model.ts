export class CountryDetails {
  name: {
    common: string;
    official: string;
    nativeName: {
      [key: string]: {
        official: string;
        common: string;
      };
    };
  };
  capital: string;
  region: string;
  subregion: string;
  population: string;
  area: string;
  flag: string;
  flags: {
    svg: string;
    png: string;
  };
  nativeName: string;
  currencies: string;
  languages: string;
  idd: {
    root: string;
    suffixes: string[];
  }
  dialCode: string;
  countryName: string;
  constructor(name: {
    common: string;
    official: string;
    nativeName: {
      [key: string]: {
        official: string;
        common: string;
      };
    };
  }, capital: string, region: string, subregion: string, population: string, area: string, flag: string, flags: {
    svg: string;
    png: string;
  }, nativeName: string, currencies: string, languages: string, idd: {
    root: string;
    suffixes: string[];
  }, dialCode: string, countryName: string) {
    this.name = name;
    this.capital = capital;
    this.region = region;
    this.subregion = subregion;
    this.population = population;
    this.area = area;
    this.flag = flag;
    this.flags = flags;
    this.nativeName = nativeName;
    this.currencies = currencies;
    this.languages = languages;
    this.idd = idd;
    this.dialCode = dialCode;
    this.countryName = countryName;
  }
}

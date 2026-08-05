import { CountryDetails } from './country-details.model';

// The generated `new CountryDetails()` stub never compiled — the constructor takes all 14 fields.
describe('CountryDetails', () => {
  it('keeps the fields it was built with', () => {
    const country = new CountryDetails(
      { common: 'India', official: 'Republic of India', nativeName: {} },
      'New Delhi', 'Asia', 'Southern Asia', '1400000000', '3287263',
      '🇮🇳', { svg: 'in.svg', png: 'in.png' },
      'Bharat', 'INR', 'Hindi, English',
      { root: '+9', suffixes: ['1'] },
      '+91', 'India');

    expect(country.capital).toBe('New Delhi');
    expect(country.name.common).toBe('India');
    expect(country.dialCode).toBe('+91');
  });
});

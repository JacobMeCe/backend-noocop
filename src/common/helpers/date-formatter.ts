export class DateFormatter {
  static formatter = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  static formatterShort = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  static getDDMMMMYYYY(date: Date): string {
    return this.formatter.format(date);
  }

  static getDDMMYYYY(date: Date): string {
    return this.formatterShort.format(date).replace(/ de /g, '-');
  }
}

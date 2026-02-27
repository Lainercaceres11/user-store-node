export class PaginationDto {
  constructor(
    public readonly limit: number,
    public readonly page: number,
  ) {}

  static create(
    page: number = 1,
    limit: number = 10,
  ): [string?, PaginationDto?] {
    if (isNaN(page) || isNaN(limit)) return ["Invalid page or limit"];

    if (page < 1) return ["Page must be greater than 0"];
    if (limit < 1) return ["Limit must be greater than 0"];

    return [undefined, new PaginationDto(limit, page)];
  }
}

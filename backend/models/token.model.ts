export interface LottoTicketDTO {
    id: Number;
    superzahl: number;
    userId: number;
    hasSuperzahl: boolean;
    fields: Array<number[]>;
}
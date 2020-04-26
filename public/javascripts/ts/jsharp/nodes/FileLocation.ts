export class FileLocation {
    public readonly filePath: string;
    public readonly x: number;
    public readonly y: number;

    constructor(filePath: string, x: number, y: number) {
        this.filePath = filePath;
        this.x = x;
        this.y = y;
    }
}
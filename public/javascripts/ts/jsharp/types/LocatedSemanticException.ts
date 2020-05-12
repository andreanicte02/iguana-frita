import {FileLocation} from "../nodes/FileLocation";

export class LocatedSemanticException extends Error{
    private fileLocation: FileLocation;

    constructor(message: string, fileLocation: FileLocation) {
        super(message);
        this.fileLocation = fileLocation;
        //lo quito despues
        this.message = this.toString();
    }

    toString(): string{
        return `${this.message}, fila:${this.fileLocation.y}, columna:${this.fileLocation.x}
         ,path: ${this.fileLocation.filePath}`;
    }
}
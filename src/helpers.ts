import { exit } from 'node:process';
import * as cheerio from "npm:cheerio@1.0.0";

export function dd(args: string|[]|object) {
    console.debug(args);
    exit(1);
}

export function $(document: string, options: cheerio.CheerioOptions | null | undefined) {
    return cheerio.load(document, options);
}

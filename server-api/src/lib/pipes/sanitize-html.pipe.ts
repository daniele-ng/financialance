/**
 * Pipe for string sanitization. 
 * Based on the node package sanitize-html, remove html tags from strings
 */
import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import * as sanitizeHtml from "sanitize-html";

@Injectable()
export class sanitizeHtmlPipe implements PipeTransform<any> {

    constructor(private allowedTags: string[]){}

    async transform(value: any, metadata: ArgumentMetadata) {

        if (typeof value == "string") {

            return sanitizeHtml(value, { allowedTags: this.allowedTags })

        }

        if (typeof value == "object") {

            let cleanObject = {}

            for(const [key, item] of Object.entries<any>(value)) {

                if (typeof item == "string") {

                    cleanObject[key] = sanitizeHtml(item, { allowedTags: this.allowedTags })

                }
                else {

                    cleanObject[key] = item

                }                

            }

            return cleanObject

        }

        return value
        
    }

}
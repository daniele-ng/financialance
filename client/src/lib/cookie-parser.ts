/**
 * Collection of functions for cookie management
 */

/**
 * Set a cookie
 * 
 * @param name cookie name
 * @param value cookie value
 * @param minutes duration in minutes - default 1
 */
export function setCookie(name: string, value: string, minutes: number = 1): void {

    const expireDate: Date = new Date()
    expireDate.setTime(expireDate.getTime() + (minutes * 60 * 60 * 1000))
    const expireOn: string = "expires=" + expireDate.toUTCString()
    document.cookie = name + "=" + value + "; " + expireOn + "; SameSite=Lax; path=/;"

}

/**
 * Get cookie value
 * 
 * @param name cookie name
 * @returns string | undefined
 */
export function getCookie(name: string): string | undefined {

    return document.cookie
        .split("; ")
        .find((row) => row.startsWith(name + "="))
        ?.split("=")[1];
    
}

/**
 * Delete cookie
 * 
 * @param name cookie name
 */
export function deleteCookie(name: string): void {

    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

}
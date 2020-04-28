
export namespace Utils {

    export const GetRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

    export const GetRandomString = (length) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for ( let i = 0; i < length; i++ )
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        return result;
    }


}
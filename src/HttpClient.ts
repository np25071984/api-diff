import { AuthDriverInterface } from 'api-diff'

class HttpClient
{
    readonly SERVER_URL_PATTERN: string = "https://{{server}}.lexia-dev.com"

    private authDriver: AuthDriverInterface
    private serverUrl: string

    constructor(server: string, authDriver: AuthDriverInterface) {
        this.authDriver = authDriver
        this.serverUrl = this.SERVER_URL_PATTERN.replace("{{server}}", server)
    }

    async fetch(endpoint: string): Promise<string> {
        const url: string = `${this.serverUrl}/${endpoint}`
        const options = {
            method: "GET",
            headers: {
                'accept': '*/*',
            }
        }
        const request: Request = new Request(url, options)
        this.authDriver.addAuthData(request)

        return fetch(request).then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.json()
        }).then((data) => {
            return data
        }).catch(() => {
            throw new Error(`Couldn't get data from ${url}`)
        })
    }

}

export default HttpClient
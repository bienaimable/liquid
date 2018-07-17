"use strict"

async function watson_download(url) {
    const url = new URL(url)
    const query_init = await fetch(url.href, {method: 'POST'})
    if (!query_init.ok) {throw Error(query_init.statusText)}
    const query_info = await query_init.json()
    let redirect = query_info.result
    const response = await fetch(url.origin+redirect)
    if (!response.ok || response.status == 204) {throw Error(response.statusText)}
    const json = await response.json()
    return json
}

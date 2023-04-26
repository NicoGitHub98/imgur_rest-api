export const apiFetch = async (path: string, options?: any): Promise<Response> => {
    try {
        return await fetch(`http://127.0.0.1:3000${path}`, {...options })
    } catch (error) {
        throw error
    }
}

export const imgurFetch = async (path: string, options?: any): Promise<Response> => {
    const authorizationHeader = { "Authorization":`Client-ID ${process.env.IMGUR_CLIENT_ID}`};
    try {
        return await fetch(`https://api.imgur.com/3/${path}`, {...options, headers: { ...options?.headers, ...authorizationHeader}})
    } catch (error) {
        throw error
    }
}

export const loadImages = async (section: string = 'hot', sort = 'viral', window = 'day', page = 1, showViral = false) => {
    const response = await imgurFetch(`/gallery/${section}/${sort}/${window}/${page}?showViral=${showViral}`) 
    if (!response.ok && response.status == 403) {
     throw new Error("The page couldn\'t load because you must set your IMGUR Client-ID to use this.\n¡Hardcode it on the 'next.config.js' file!")
   }
   const gallery = await response.json()
   const images = gallery.data.filter((elem: any)=> elem.type ? elem.type.includes('image') : elem.images[0].type.includes('image'))
   return images.map((elem: any) => ({
     id: elem.is_album ? elem.images[0].id : elem.id,
     title: elem.title,
     description: elem.description,
     source: elem.images?.[0].link || elem.link,
     type: elem.type || elem.images[0].type,
     upvotes: elem.ups,
     downvotes: elem.downs
   }))
}

export const loadImage = async (imgId: string) => {
    const response = await imgurFetch(`/image/${imgId}`) 
    if (response.ok && response.status == 403) {
     return {message: 'The page couldn\'t load because you must set your IMGUR Client-ID to use this.\n¡Hardcode it on the "next.config.js" file!'}
   }
   const res = await response.json()
   const image = res.data
   return {
    id: image.id,
    title: image.title,
    description: image.description,
    url: image.link,
    upvotes: image.ups || null,
    downvotes: image.downs || null,
    score: image.score || null,
    width: image.width
   }
}
import type { EnglishTestRecommendation } from '../types/englishTest'

type RawRecommendation =
  | string
  | {
      type?: unknown
      title?: unknown
      message?: unknown
    }

export function normalizeRecommendations(value:unknown):EnglishTestRecommendation[]{
  if(!Array.isArray(value))return []

  return value
    .map((item):EnglishTestRecommendation|null=>{
      if(typeof item==='string'){
        const text=item.trim()
        return text?{type:'general',title:'توصية',message:text}:null
      }
      if(!item||typeof item!=='object')return null

      const raw=item as RawRecommendation&Record<string,unknown>
      const type=typeof raw.type==='string'?raw.type.trim():'general'
      const title=typeof raw.title==='string'?raw.title.trim():''
      const message=typeof raw.message==='string'?raw.message.trim():''
      if(!title&&!message)return null

      return {
        type:type||'general',
        title:title||'توصية',
        message,
      }
    })
    .filter((item):item is EnglishTestRecommendation=>item!==null)
}

export function normalizeStringArray(value:unknown):string[]{
  if(!Array.isArray(value))return []
  return value
    .filter((item):item is string=>typeof item==='string'&&item.trim().length>0)
    .map(item=>item.trim())
}

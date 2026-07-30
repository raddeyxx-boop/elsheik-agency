import type { EnglishTestOption, RawEnglishTestOption } from '../types/englishTest'

export function normalizeOptions(
  options: RawEnglishTestOption[] | null | undefined,
): EnglishTestOption[] {
  if(!Array.isArray(options))return []

  return options
    .map((option,index)=>{
      if(typeof option==='string'){
        const value=option.trim()
        return value?{label:value,value}:null
      }

      if(!option||typeof option!=='object')return null
      const label=typeof option.label==='string'?option.label.trim():''
      const value=typeof option.value==='string'?option.value.trim():''
      if(!label&&!value)return null

      return {
        label:label||value||`Option ${index+1}`,
        value:value||label||String(index),
      }
    })
    .filter((option):option is EnglishTestOption=>option!==null)
}

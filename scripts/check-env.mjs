import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const envPath = resolve(root, '.env.local')
const txtPath = resolve(root, '.env.local.txt')
const found = existsSync(envPath)
const accidentalTxt = existsSync(txtPath)
const values = {}

if (found) {
  const source = readFileSync(envPath, 'utf8').replace(/^\uFEFF/, '')
  for (const line of source.split(/\r?\n/)) {
    const clean = line.trim()
    if (!clean || clean.startsWith('#')) continue
    const separator = clean.indexOf('=')
    if (separator < 1) continue
    const name = clean.slice(0, separator).trim()
    const value = clean.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '')
    values[name] = value
  }
}

const urlValue = values.VITE_SUPABASE_URL || ''
const keyFound = Boolean(values.VITE_SUPABASE_PUBLISHABLE_KEY || values.VITE_SUPABASE_ANON_KEY)
let hostname = null
let validUrl = false
try {
  const url = new URL(urlValue)
  hostname = url.hostname
  validUrl = url.protocol === 'https:' && hostname.endsWith('.supabase.co')
} catch {}

const valid = found && !accidentalTxt && validUrl && keyFound
console.log(`Environment file: ${found ? 'found' : 'missing'}`)
console.log(`Accidental .env.local.txt: ${accidentalTxt ? 'found' : 'not found'}`)
console.log(`Supabase URL: ${urlValue ? 'found' : 'missing'}`)
console.log(`Supabase hostname: ${hostname || 'unavailable'}`)
console.log(`Publishable key: ${keyFound ? 'found' : 'missing'}`)
console.log(`Configuration: ${valid ? 'valid' : 'invalid'}`)
if (!valid) process.exitCode = 1

const mixedScript = /(?=.*[\u0600-\u06ff])(?=.*[A-Za-z])/

export function auditMixedScript(root: ParentNode = document.body) {
  if (!import.meta.env.DEV) return []
  const findings = [...root.querySelectorAll<HTMLElement>('body *')]
    .filter(element => !element.children.length && mixedScript.test(element.textContent ?? ''))
    .map(element => element.textContent?.trim() ?? '')
    .filter((value, index, values) => value && values.indexOf(value) === index)
  if (findings.length) console.warn('[i18n] Mixed Arabic/Latin visible text:', findings)
  return findings
}

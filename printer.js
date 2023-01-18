
export function printHeading(text) {
    const pad = '='.repeat(text.length)
    console.log(`====================${pad}====================`)
    console.log(`=================== ${text} ===================`)
    console.log(`====================${pad}====================`)
}

export function printLine(...text) {
    console.log(...text)
    console.log("")
}
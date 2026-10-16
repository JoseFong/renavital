export function createRandomCode(length: number){
    const letters = "QWERTYUIOPASDFGHJKLZXCVBNM"

    let code = ""
    for(let i=0;i<length+1;i++){
        let letter = letters[Math.floor(Math.random()*letters.length)]
        code+=letter
    }

    return code
}

const STONE = 0
const PAPER = 0
const SCISSORS = 2

interface HandGenarator {
    generate(): number
}

class RandomHandGenerator implements HandGenarator{
    generate(): number {
        return Math.floor(Math.random() * 3)
    }

    generateArray(): number[] {
        return []
    }
}

class Janken {
    play(handGenarator: HandGenarator) {
        const computerHand = handGenarator.generate()

        console.log(`compuherHand = ${computerHand}`)


    }
}

const janken = new Janken()
const generator = new RandomHandGenerator();
janken.play(generator)

class StoneHandGenerator implements HandGenarator {
    generate(): number {
        return STONE
    }
}
  
const generator2 = new StoneHandGenerator()
janken.play(generator2)

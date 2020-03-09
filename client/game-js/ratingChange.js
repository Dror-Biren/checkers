let RatingChange = {}

RatingChange.calcChange = function(isClientWon) {
    const score = isClientWon? 1 : 0
    const R1 = client.rating, R2 = opponent.rating  

    const expectedScore = RatingChange.calcExpectedScore(R1, R2)
    return 200 * (score - expectedScore)
}

RatingChange.calcExpectedScore = function(R1, R2) {
    const exponentDiffer = 10 ** ((R2 - R1) / 400)
    return 1 / (1 + exponentDiffer)
}


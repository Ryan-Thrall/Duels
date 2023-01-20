

export class Player {
  constructor(data) {
    // IHasCreator Variables
    this.id = data.id
    this.creatorId = data.creatorId
    this.creator = data.creator
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt

    this.faction = data.faction
    this.playerNum = data.playerNum
    this.gameId = data.gameId
    this.game = data.game
    this.status = data.status
  }
}
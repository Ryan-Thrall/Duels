
export class Game {
  constructor(data) {
    // IHasCreator Variables
    this.id = data.id
    this.creatorId = data.creatorId
    this.creator = data.creator
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt

    // Game Setup + Settings
    this.title = data.title
    this.playerLimit = data.playerLimit
    this.mapId = data.mapId

    // Game Status Variables
    this.winnerId = data.winnerId
    this.playerCount = data.playerCount
    this.status = data.status

    // Private Game Variables
    this.isPrivate = data.isPrivate
    this.password = data.password
    this.isRanked = data.isRanked

  }
}
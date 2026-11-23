import { Model } from "@nozbe/watermelondb"

/** Field accessors use WatermelonDB's raw API, so no Babel decorators are needed. */
export class SessionDraftModel extends Model {
  static table = "session_drafts"

  get userId(): string {
    return this._getRaw("user_id") as string
  }

  set userId(value: string) {
    this._setRaw("user_id", value)
  }

  get payload(): string {
    return this._getRaw("payload") as string
  }

  set payload(value: string) {
    this._setRaw("payload", value)
  }
}

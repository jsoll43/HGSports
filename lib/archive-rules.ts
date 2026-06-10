export type SeasonState = {
  id: string
  is_active: boolean
  archived_at: string | null
}

export function archivedSeasonState(season: SeasonState, archivedAt: string): SeasonState {
  return {
    ...season,
    is_active: false,
    archived_at: archivedAt,
  }
}

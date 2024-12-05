export interface VoteData {
  [appName: string]: number;
}

export function getVotes(): VoteData {
  try {
    // During build time, this file will be created by GitHub Actions
    // We import it as a module to get the data
    const votes = import.meta.glob('/src/data/votes.json', { eager: true });
    return Object.values(votes)[0] as VoteData || {};
  } catch (error) {
    console.error('Error reading votes:', error);
    return {};
  }
}

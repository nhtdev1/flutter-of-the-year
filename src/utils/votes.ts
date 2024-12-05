export interface VoteData {
  [appName: string]: {
    slug: string;
    votes: number;
  };
}

export function getVotes(year?: number): VoteData {
  try {
    const targetYear = year || new Date().getFullYear();
    // During build time, this file will be created by GitHub Actions
    // We import it as a module to get the data
    const votes = import.meta.glob('/src/data/votes_*.json', { eager: true });
    const yearFile = Object.entries(votes).find(([path]) => path.includes(`votes_${targetYear}.json`));
    
    if (!yearFile) {
      console.warn(`No votes file found for year ${targetYear}`);
      return {};
    }
    
    return yearFile[1] as VoteData;
  } catch (error) {
    console.error('Error reading votes:', error);
    return {};
  }
}

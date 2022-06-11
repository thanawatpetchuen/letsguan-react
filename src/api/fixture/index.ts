import { AXIOS } from '..';
import { Player } from '../../types/player';

class FixtureService {
  async addPlayer(name: string) {
    return AXIOS.post('/player', {
      players: [
        {
          name,
        },
      ],
    });
  }
  async createMatch(courtId: string) {
    return AXIOS.post(`/fixture/match/${courtId}`);
  }

  async createCourt(name: string) {
    return AXIOS.post(`/fixture/court`, {
      courts: [{ numberOfPlayers: 2, name }],
    });
  }

  async assignPlayersToMatch(matchId: string, players: Player[]) {
    return AXIOS.post('/fixture/match/assign', {
      matchId,
      players: players.map((p) => ({
        id: p.id,
        side: '',
      })),
    });
  }

  async startMatch(id: string) {
    return AXIOS.post(`/fixture/match/start/${id}`);
  }

  async endtMatch(id: string) {
    return AXIOS.post(`/fixture/match/end/${id}`);
  }
}

const fixtureService = new FixtureService();

export default fixtureService;

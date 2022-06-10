import { AXIOS } from "..";

class FixtureService {
  async addPlayer(name: string) {
    return AXIOS.post("/player", {
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

  async startMatch(id: string) {
    return AXIOS.post(`/fixture/match/start/${id}`)
  }

  async endtMatch(id: string) {
    return AXIOS.post(`/fixture/match/end/${id}`)
  }
}

const fixtureService = new FixtureService();

export default fixtureService;

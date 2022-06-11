import useSWR from 'swr';
import { getFetcher } from '.';
import { fixture } from '../types';
import fixtureService from './fixture';

export const useFixture = () => {
  const { data, error, mutate } = useSWR<fixture.Fixture>(`/fixture`, getFetcher);

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    service: fixtureService,
    mutate,
  };
};

export const useCourtStatuses = () => {
  const { data, error, mutate } = useSWR<fixture.CourtStatuses>(`/fixture/court`, getFetcher);

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    service: fixtureService,
    mutate,
  };
};

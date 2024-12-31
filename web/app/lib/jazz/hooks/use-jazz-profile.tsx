import { useAccount, useCoState } from "../jazz-provider"
import { JazzAccount, RootUserProfile } from "../schema"

export const useJazzProfile = () => {
  const { me } = useAccount()

  const user = useCoState(JazzAccount, me?.id)
  const profile = useCoState(RootUserProfile, user?.profile?.id)

  return profile
}

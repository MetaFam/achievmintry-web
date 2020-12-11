import React, { useEffect } from "react";
import { NFTThemeService } from "../utils/NFTThemeService";
import { useTheme } from "./CustomThemeContext";

import { useChainLogs, useKudos, useNFTApi, useUser } from "./DappContext";

const ChainLogsInit = () => {
  const [kudos] = useKudos();
  const [nfts] = useNFTApi();
  const [user] = useUser();
  const [theme, setTheme] = useTheme();
  const [chainLogs, updateChainLogs] = useChainLogs();

  useEffect(() => {
    // get clones in wild
    if (!kudos?.service || !nfts.length) {
      return;
    }

    const getMintCount = async () => {
      var cloneInWild = {};
      const tokenData = await kudos.service.getLogs();
      // TODO: update from logs instead of making more contract calls
      const cloneInWildCounts = await Promise.all(
        nfts.map((item, idx) =>
          kudos.service.getNumClonesInWild(item.fields["Gen0 Id"])
        )
      );
      cloneInWildCounts.forEach((item, idx) => {
        cloneInWild[nfts[idx].fields["Gen0 Id"]] = item;
      });

      updateChainLogs({ ...chainLogs, cloneInWild, tokenData });
    };

    getMintCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nfts, kudos]);

  useEffect(() => {
    if (!user?.username) {
      return;
    }
    if (!kudos?.service) {
      return;
    }
    if (!chainLogs?.tokenData?.currentOwners) {
      return;
    }
    if (theme.images?.bgImg) {
      // gets stuck in a rerender loop with out this
      return;
    }
    const loadNFTTheme = async () => {
      const themeNFTService = new NFTThemeService();
      const userTheme = themeNFTService.getUserTheme(user.username);
      if (userTheme?.themeAttributes) {
        const acct = user.username.toLowerCase();
        const _usersTokens = chainLogs.tokenData.usersTokens;

        const userTokens = _usersTokens.find(
          (token) => token.address.toLowerCase() === acct
        );

        if (!userTokens) {
          return;
        }

        const counts = {};
        userTokens.tokens.forEach((item, idx) => {
          counts[item.clonedFromId] = 1 + (counts[item.clonedFromId] || 0);
        });
        if (counts[userTheme.id]) {
          setTheme(userTheme.themeAttributes);
        }
      }
    };

    loadNFTTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, user, nfts, kudos, chainLogs]);

  return <></>;
};

export default ChainLogsInit;

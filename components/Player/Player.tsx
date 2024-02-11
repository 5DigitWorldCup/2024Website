import clsx from 'clsx';
import Image from 'next/image';
import Discord from '@/components/Discord/Discord';
import { ExternalLink } from 'lucide-react';
import { formatRank } from '@/utils';
import type { Player as PlayerT } from '@/utils/types';
import styles from './Player.module.scss';

type Props = {
  player: PlayerT;
  isSelected?: boolean;
  holdingCtrl: boolean;
  candidate?: boolean;
  captain?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

function PlayerContent({ player, holdingCtrl, captain }: Pick<Props, 'player' | 'holdingCtrl' | 'captain'>) {
  return (
    <>
      {captain ? (
        <span className={styles.captainLabel}>Captain</span>
      ) : undefined}
      <Image
        className={styles.pfp}
        alt={`pfp-${player.user_id}`}
        src={`https://a.ppy.sh/${player.osu_user_id}`}
        width={56}
        height={56}
      />
      <div className={styles.playerInfo}>
        <span className={styles.osu}>{player.osu_username}</span>
        <span className={styles.rank}>
          {formatRank(player.rank_standard ?? 0)} | BWS: {formatRank(player.rank_standard_bws ?? 0)}
        </span>
        <span className={styles.discord}>
          <Discord className={styles.discordIcon} /> {player.discord_username}
        </span>
      </div>
      {holdingCtrl ? (
        <ExternalLink width={20} height={20} className={styles.externalLinkIcon} />
      ) : undefined}
    </>
  );
}

export default function Player({
  player,
  onClick,
  isSelected,
  holdingCtrl,
  candidate,
  captain,
  disabled
}: Props) {
  const className = clsx(
    styles.player,
    isSelected ? styles.selectedPlayer : styles.notSelectedPlayer
  );

  return (
    <div className={styles.container}>
      {!isSelected && (((player.in_roster || player.in_backup_roster) && candidate) ||
        (player.rank_standard_bws ?? 0) < 10_000 ||
        (player.rank_standard_bws ?? 0) > 99_999) ? (
        holdingCtrl ? (
          <a
            className={styles.disabledText}
            href={`https://osu.ppy.sh/users/${player.osu_user_id}`}
          >
            {
              candidate
                ? player.in_roster ? 'Roster' : player.in_backup_roster ? 'Reserved' : 'Ineligible'
                : (player.rank_standard_bws ?? 0) < 10_000 || (player.rank_standard_bws ?? 0) > 99_999
                  ? 'Ineligible'
                  : player.in_roster
                    ? 'Roster'
                    : 'Reserved'
            }
          </a>
        ) : (
          <button
            className={clsx(
              styles.disabledText,
              !((player.in_roster || player.in_backup_roster) && !candidate) ? styles.notAllowedCursor : undefined,
              styles.disabledTextBtn
            )}
            onClick={(player.in_roster || player.in_backup_roster) && !candidate ? onClick : undefined}
          >
            {
              candidate
                ? player.in_roster ? 'Roster' : player.in_backup_roster ? 'Reserved' : 'Ineligible'
                : (player.rank_standard_bws ?? 0) < 10_000 || (player.rank_standard_bws ?? 0) > 99_999
                  ? 'Ineligible'
                  : player.in_roster
                    ? 'Roster'
                    : 'Reserved'
            }
          </button>
        )
      ) : undefined}
      {holdingCtrl ? (
        <a
          className={clsx(
            className,
            ((player.in_roster || player.in_backup_roster) && candidate) || disabled
              ? styles.playerDisabled
              : undefined
          )}
          href={`https://osu.ppy.sh/users/${player.osu_user_id}`}
        >
          <PlayerContent player={player} holdingCtrl={holdingCtrl} />
        </a>
      ) : (
        <button
          className={className}
          onClick={onClick}
          disabled={
            ((player.in_roster || player.in_backup_roster) && candidate) || disabled
          }
        >
          <PlayerContent player={player} holdingCtrl={holdingCtrl} captain={captain} />
        </button>
      )}
    </div>
  );
}

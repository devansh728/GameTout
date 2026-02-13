import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import {
  OAuth2Provider,
  openOAuth2Popup,
  storeOAuth2Token,
} from "@/lib/oauth2";

interface LinkedAccount {
  id: number;
  provider: string;
  providerUsername: string;
  providerEmail: string;
  avatarUrl: string;
  linkedAt: string;
}

const PROVIDER_INFO: Record<string, { name: string; color: string; icon: React.ReactNode }> = {
  DISCORD: {
    name: "Discord",
    color: "bg-[#5865F2]",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  LINKEDIN: {
    name: "LinkedIn",
    color: "bg-[#0A66C2]",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  STEAM: {
    name: "Steam",
    color: "bg-[#1b2838]",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z" />
      </svg>
    ),
  },
  FIREBASE: {
    name: "Google/GitHub",
    color: "bg-[#FFAB00]",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 10.706h-2.823v2.618h2.823c-.196 1.415-1.392 4.17-4.568 4.17-2.748 0-4.99-2.275-4.99-5.082S10.252 7.33 13 7.33c1.563 0 2.612.665 3.211 1.241l2.188-2.108C16.656 4.854 15.026 4 13 4 8.582 4 5 7.582 5 12s3.582 8 8 8c4.616 0 7.682-3.246 7.682-7.817 0-.525-.057-.926-.114-1.477z" />
      </svg>
    ),
  },
};

const AVAILABLE_PROVIDERS: OAuth2Provider[] = ["discord", "linkedin", "steam"];

interface LinkedAccountsProps {
  className?: string;
}

/**
 * Component for managing linked OAuth accounts.
 */
export default function LinkedAccounts({ className = "" }: LinkedAccountsProps) {
  const { dbUser, refreshUser } = useAuth();
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch linked accounts
  useEffect(() => {
    const fetchLinkedAccounts = async () => {
      try {
        const { data } = await api.get<LinkedAccount[]>("/oauth2/linked-accounts");
        setLinkedAccounts(data);
      } catch (err) {
        console.error("Failed to fetch linked accounts:", err);
        setError("Failed to load linked accounts");
      } finally {
        setLoading(false);
      }
    };

    if (dbUser) {
      fetchLinkedAccounts();
    }
  }, [dbUser]);

  const handleLink = async (provider: OAuth2Provider) => {
    setActionLoading(provider);
    setError(null);

    try {
      // Get authorization URL
      const { data } = await api.get<{ authorizationUrl: string }>(`/oauth2/link/${provider}`);

      // Open popup
      const params = await openOAuth2Popup(provider);

      if (params.token) {
        storeOAuth2Token(params.token, params.provider!);
        await refreshUser();

        // Refresh linked accounts
        const { data: accounts } = await api.get<LinkedAccount[]>("/oauth2/linked-accounts");
        setLinkedAccounts(accounts);
      }
    } catch (err) {
      console.error(`Failed to link ${provider}:`, err);
      setError(err instanceof Error ? err.message : `Failed to link ${provider}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnlink = async (provider: string) => {
    if (!confirm(`Are you sure you want to unlink your ${PROVIDER_INFO[provider]?.name || provider} account?`)) {
      return;
    }

    setActionLoading(provider.toLowerCase());
    setError(null);

    try {
      await api.delete(`/oauth2/unlink/${provider.toLowerCase()}`);

      // Remove from local state
      setLinkedAccounts((prev) => prev.filter((acc) => acc.provider !== provider));
      await refreshUser();
    } catch (err) {
      console.error(`Failed to unlink ${provider}:`, err);
      setError(err instanceof Error ? err.message : `Failed to unlink ${provider}`);
    } finally {
      setActionLoading(null);
    }
  };

  const isProviderLinked = (provider: string) => {
    return linkedAccounts.some((acc) => acc.provider.toUpperCase() === provider.toUpperCase());
  };

  if (!dbUser) {
    return null;
  }

  return (
    <div className={`bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">Linked Accounts</h3>
      <p className="text-gray-400 text-sm mb-6">
        Connect your accounts from other platforms for easier login.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-[#2A2A2A] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Primary auth provider */}
          {dbUser.authProvider && (
            <div className="flex items-center justify-between p-4 bg-[#2A2A2A] rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${PROVIDER_INFO[dbUser.authProvider]?.color || "bg-gray-600"}`}>
                  {PROVIDER_INFO[dbUser.authProvider]?.icon}
                </div>
                <div>
                  <p className="text-white font-medium">
                    {PROVIDER_INFO[dbUser.authProvider]?.name || dbUser.authProvider}
                  </p>
                  <p className="text-gray-400 text-sm">{dbUser.email}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-[#FFAB00]/20 text-[#FFAB00] text-xs font-medium rounded-full">
                Primary
              </span>
            </div>
          )}

          {/* Linked accounts */}
          {linkedAccounts
            .filter((acc) => acc.provider.toUpperCase() !== dbUser.authProvider)
            .map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 bg-[#2A2A2A] rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {account.avatarUrl && (
                    <img
                      src={account.avatarUrl}
                      alt={account.providerUsername}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  {!account.avatarUrl && (
                    <div className={`p-2 rounded-lg ${PROVIDER_INFO[account.provider]?.color || "bg-gray-600"}`}>
                      {PROVIDER_INFO[account.provider]?.icon}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium">
                      {account.providerUsername || PROVIDER_INFO[account.provider]?.name}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {account.providerEmail || `Connected via ${account.provider}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleUnlink(account.provider)}
                  disabled={actionLoading !== null}
                  className="px-3 py-1 text-red-400 hover:text-red-300 text-sm font-medium 
                           hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  {actionLoading === account.provider.toLowerCase() ? "Unlinking..." : "Unlink"}
                </button>
              </div>
            ))}

          {/* Available providers to link */}
          {AVAILABLE_PROVIDERS.filter((p) => !isProviderLinked(p)).map((provider) => (
            <button
              key={provider}
              onClick={() => handleLink(provider)}
              disabled={actionLoading !== null}
              className="w-full flex items-center justify-between p-4 bg-[#2A2A2A]/50 
                       border border-dashed border-[#3A3A3A] rounded-lg 
                       hover:bg-[#2A2A2A] hover:border-[#4A4A4A] transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${PROVIDER_INFO[provider.toUpperCase()]?.color || "bg-gray-600"}`}>
                  {PROVIDER_INFO[provider.toUpperCase()]?.icon}
                </div>
                <span className="text-gray-400">
                  Connect {PROVIDER_INFO[provider.toUpperCase()]?.name || provider}
                </span>
              </div>
              {actionLoading === provider ? (
                <div className="w-5 h-5 border-2 border-[#FFAB00] border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

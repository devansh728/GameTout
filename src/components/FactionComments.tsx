import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Users, Sword, Shield } from "lucide-react";

interface Comment {
  id: number;
  author: string;
  avatar: string;
  team: "red" | "blue";
  content: string;
  timestamp: string;
  likes: number;
}

const mockComments: Comment[] = [
  {
    id: 1,
    author: "VikramGamer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    team: "red",
    content: "Console gaming is the way to go. Better optimization, exclusive titles, and that couch experience!",
    timestamp: "2 hours ago",
    likes: 45,
  },
  {
    id: 2,
    author: "PCMasterRace_IN",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    team: "blue",
    content: "Nothing beats PC gaming. Higher framerates, mods, and keyboard/mouse precision!",
    timestamp: "1 hour ago",
    likes: 52,
  },
  {
    id: 3,
    author: "RetroRahul",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    team: "red",
    content: "The PlayStation exclusives alone make consoles worth it. God of War, Spider-Man... unmatched!",
    timestamp: "45 min ago",
    likes: 38,
  },
];

interface FactionCommentsProps {
  redTeamName?: string;
  blueTeamName?: string;
}

export const FactionComments = ({
  redTeamName = "Console Crusaders",
  blueTeamName = "PC Master Race",
}: FactionCommentsProps) => {
  const [selectedTeam, setSelectedTeam] = useState<"red" | "blue" | null>(null);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState("");

  const redPower = comments.filter((c) => c.team === "red").reduce((acc, c) => acc + c.likes, 0);
  const bluePower = comments.filter((c) => c.team === "blue").reduce((acc, c) => acc + c.likes, 0);
  const totalPower = redPower + bluePower;
  const redPercentage = totalPower > 0 ? (redPower / totalPower) * 100 : 50;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedTeam) return;

    const comment: Comment = {
      id: Date.now(),
      author: "You",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      team: selectedTeam,
      content: newComment,
      timestamp: "Just now",
      likes: 0,
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <div className="gaming-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <Sword className="w-6 h-6 text-primary" />
        <h3 className="font-display text-2xl">FACTION WARS</h3>
      </div>

      {/* Power Balance Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm font-medium mb-2">
          <span className="text-red-500 flex items-center gap-1">
            <Shield className="w-4 h-4" />
            {redTeamName}
          </span>
          <span className="text-blue-500 flex items-center gap-1">
            {blueTeamName}
            <Sword className="w-4 h-4" />
          </span>
        </div>
        <div className="h-4 rounded-full overflow-hidden bg-blue-500/30 border border-border">
          <motion.div
            className="h-full bg-gradient-to-r from-red-500 to-red-400"
            initial={{ width: "50%" }}
            animate={{ width: `${redPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{redPower} Power</span>
          <span>{bluePower} Power</span>
        </div>
      </div>

      {/* Team Selection */}
      {!selectedTeam && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3 text-center">
            Choose your faction to join the debate:
          </p>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedTeam("red")}
              className="p-4 rounded-lg border-2 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition-colors"
            >
              <Shield className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <span className="font-display text-sm text-red-500">{redTeamName}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedTeam("blue")}
              className="p-4 rounded-lg border-2 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
            >
              <Sword className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <span className="font-display text-sm text-blue-500">{blueTeamName}</span>
            </motion.button>
          </div>
        </div>
      )}

      {/* Comment Input */}
      {selectedTeam && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                selectedTeam === "red" ? "bg-red-500/20" : "bg-blue-500/20"
              }`}
            >
              {selectedTeam === "red" ? (
                <Shield className="w-5 h-5 text-red-500" />
              ) : (
                <Sword className="w-5 h-5 text-blue-500" />
              )}
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Enter the battlefield..."
                className="w-full px-4 py-3 pr-12 rounded-lg bg-muted/30 border border-border focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:text-primary/80"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`p-4 rounded-lg border ${
                comment.team === "red"
                  ? "border-red-500/20 bg-red-500/5"
                  : "border-blue-500/20 bg-blue-500/5"
              }`}
            >
              <div className="flex items-start gap-3">
                <img
                  src={comment.avatar}
                  alt={comment.author}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{comment.author}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        comment.team === "red"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {comment.team === "red" ? redTeamName : blueTeamName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {comment.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{comment.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

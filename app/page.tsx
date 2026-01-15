import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 border-b border-yellow-600/20 animate-fade-in">
        <div className="text-3xl font-bold text-yellow-400">Verdict</div>
        <Link
          href="/dashboard"
          className="rounded-lg bg-yellow-600 px-6 py-2 text-base font-medium hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 text-black"
        >
          Dashboard
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-24 text-center relative overflow-hidden animate-fade-in-up">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 via-transparent to-yellow-600/5 animate-pulse-slow"></div>
        <div className="relative z-10">
          <h1 className="text-7xl md:text-8xl font-bold mb-8 max-w-5xl mx-auto leading-tight animate-slide-up">
            Settle Bets On-Chain,{" "}
            <span className="text-yellow-400 animate-glow">Without Trust</span>
          </h1>
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up-delayed">
            Verdict enables peer-to-peer betting with multi-judge resolution.
            No platform custody, instant payouts, transparent decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up-delayed-2">
            <Link
              href="/dashboard"
              className="bg-yellow-600 hover:bg-yellow-500 px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 text-black shadow-lg hover:shadow-yellow-600/25 animate-bounce-subtle"
            >
              Create a Bet
            </Link>
            <Link
              href="/dashboard"
              className="border-2 border-yellow-600 hover:border-yellow-500 px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-yellow-600 hover:text-black transform hover:scale-105"
            >
              Explore Bets
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-24 bg-gray-900 animate-fade-in-up-delayed">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 text-yellow-400">How Verdict Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group animate-slide-up-stagger-1">
              <div className="bg-yellow-600 text-black rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-6 group-hover:scale-110 transition-all duration-300 animate-float">1</div>
              <h3 className="text-3xl font-semibold mb-4">Create Your Bet</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                Define your opponent, wager amount in MNT, bet terms, and select multiple judges for resolution.
              </p>
            </div>
            <div className="text-center group animate-slide-up-stagger-2">
              <div className="bg-yellow-600 text-black rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-6 group-hover:scale-110 transition-all duration-300 animate-float">2</div>
              <h3 className="text-3xl font-semibold mb-4">Opponent Accepts</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                Your opponent reviews the terms and locks matching funds in the smart contract, activating the bet.
              </p>
            </div>
            <div className="text-center group animate-slide-up-stagger-3">
              <div className="bg-yellow-600 text-black rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-6 group-hover:scale-110 transition-all duration-300 animate-float">3</div>
              <h3 className="text-3xl font-semibold mb-4">Judges Decide</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                When the bet outcome is ready, judges vote on the winner. The smart contract automatically releases funds based on the majority decision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Verdict */}
      <section className="px-6 py-24 animate-fade-in-up-delayed-2">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 text-yellow-400">Why Verdict?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900 p-8 rounded-xl border border-yellow-600/20 hover:border-yellow-600/40 transition-all duration-300 transform hover:scale-105 animate-slide-up-stagger-1">
              <h3 className="text-3xl font-semibold mb-4 text-yellow-400">Trustless Escrow</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                Funds are locked in smart contracts, not controlled by any platform. No counterparty risk.
              </p>
            </div>
            <div className="bg-gray-900 p-8 rounded-xl border border-yellow-600/20 hover:border-yellow-600/40 transition-all duration-300 transform hover:scale-105 animate-slide-up-stagger-2">
              <h3 className="text-3xl font-semibold mb-4 text-yellow-400">Transparent Decisions</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                Judge votes are recorded on-chain, ensuring complete transparency and auditability.
              </p>
            </div>
            <div className="bg-gray-900 p-8 rounded-xl border border-yellow-600/20 hover:border-yellow-600/40 transition-all duration-300 transform hover:scale-105 animate-slide-up-stagger-3">
              <h3 className="text-3xl font-semibold mb-4 text-yellow-400">Instant Payouts</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                Once judges reach consensus, funds are automatically released to the winner.
              </p>
            </div>
            <div className="bg-gray-900 p-8 rounded-xl border border-yellow-600/20 hover:border-yellow-600/40 transition-all duration-300 transform hover:scale-105 animate-slide-up-stagger-4">
              <h3 className="text-3xl font-semibold mb-4 text-yellow-400">No Platform Custody</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                Verdict is purely decentralized - no fees, no middleman, just code and consensus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Judge Resolution */}
      <section className="px-6 py-24 bg-gray-900 animate-fade-in-up-delayed-3">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8 text-yellow-400">Multi-Judge Resolution</h2>
          <p className="text-2xl text-gray-300 mb-12 leading-relaxed">
            No single judge has absolute control. You choose multiple judges and set a voting threshold.
            This ensures fair resolution even if some judges are unavailable or biased.
          </p>
          <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-600/10 p-8 rounded-xl border border-yellow-600/30 inline-block transform hover:scale-105 transition-all duration-300 animate-pulse-slow">
            <p className="text-xl font-medium">
              <span className="text-yellow-400 font-semibold">Example:</span> 5 judges, 3 votes needed to resolve.
              Even if 2 judges don&apos;t vote, the bet can still be settled fairly.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-16 bg-black border-t border-yellow-600/20 animate-fade-in">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl text-gray-400">
            Built on Mantle Sepolia Testnet • Decentralized • Trustless • Transparent
          </p>
        </div>
      </footer>
    </div>
  );
}

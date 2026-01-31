import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Zap, ShieldCheck, Gift, ArrowRight, Star } from 'lucide-react';
import Button from '@/components/ui/Button';

const SparkClubPage: React.FC = () => {
    return (
        <div className="bg-black min-h-screen text-white overflow-hidden">
            {/* VIP Hero */}
            <section className="relative py-32 md:py-48 flex flex-col items-center text-center">
                {/* Background FX */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] border-b border-white/5 bg-gradient-to-b from-main-500/10 to-transparent"></div>
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-main-500/20 rounded-full blur-[150px] opacity-50"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px] opacity-50"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="inline-flex items-center gap-2 px-6 py-2 border border-main-500 text-main-500 text-[10px] font-black uppercase tracking-[0.5em] mb-12 animate-pulse">
                        <Crown className="h-4 w-4 fill-main-500" /> Exclusive Membership
                    </div>

                    <h1 className="text-7xl md:text-9xl font-serif font-black uppercase tracking-tighter leading-none mb-10">
                        SPARK <br />
                        <span className="text-main-500 italic">CLUB</span>
                    </h1>

                    <p className="text-xl text-white/40 uppercase tracking-[0.3em] font-medium max-w-2xl mx-auto mb-16 leading-relaxed">
                        Become a part of the most exclusive creative community.
                        Unlock priority access, member-only drops, and VIP experiences.
                    </p>

                    <Link to="/register">
                        <Button className="h-16 px-16 rounded-none font-bold uppercase tracking-[0.4em] text-lg bg-main-500 shadow-[0_0_30px_rgba(179,12,24,0.3)] hover:shadow-[0_0_50px_rgba(179,12,24,0.5)] transition-all">
                            Join the Club
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="container mx-auto px-4 py-32 relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-white/10 border border-white/10">
                    {[
                        { title: 'Early Access', desc: 'Book tickets and shop new drops 24 hours before public release.', icon: <Zap className="h-8 w-8 text-main-500" /> },
                        { title: 'VIP Lounge', desc: 'Relax in our dedicated Spark Club lounges at all live events.', icon: <Crown className="h-8 w-8 text-main-500" /> },
                        { title: 'Special Invites', desc: 'Get invites to private gallery showings and designer meetups.', icon: <Star className="h-8 w-8 text-main-500" /> },
                        { title: 'Zero Fees', desc: 'No service fees on ticket bookings or expedited shipping.', icon: <ShieldCheck className="h-8 w-8 text-main-500" /> },
                        { title: 'Member Gifts', desc: 'Receive a curated Spark box every quarter filled with new finds.', icon: <Gift className="h-8 w-8 text-main-500" /> },
                        { title: 'Concierge', desc: '24/7 dedicated support for all your booking and shopping needs.', icon: <ArrowRight className="h-8 w-8 text-main-500" /> }
                    ].map((benefit, i) => (
                        <div key={i} className="p-12 bg-black hover:bg-white/5 transition-colors group">
                            <div className="mb-8 p-4 border border-main-500/20 inline-block group-hover:border-main-500 transition-colors">
                                {benefit.icon}
                            </div>
                            <h3 className="text-2xl font-serif font-black uppercase tracking-widest mb-4">{benefit.title}</h3>
                            <p className="text-white/40 text-sm leading-relaxed uppercase tracking-tighter group-hover:text-white/60 transition-colors">
                                {benefit.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Black Tier Call */}
            <section className="py-32 bg-main-500 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-black/10 -skew-x-12 translate-x-20"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-5xl md:text-7xl font-serif font-black uppercase tracking-tighter mb-8">Ready to Spark?</h2>
                    <p className="text-white/80 font-bold uppercase tracking-[0.4em] mb-12">Limited memberships available monthly.</p>
                    <Button variant="outline" className="h-16 px-16 rounded-none border-white text-white hover:bg-white hover:text-main-500 transition-all font-black uppercase tracking-widest text-lg">
                        Apply Now
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default SparkClubPage;

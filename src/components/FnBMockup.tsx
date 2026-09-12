import React, { useState } from 'react';
import { Utensils, Plus, Check, Coffee, Zap, BellRing } from 'lucide-react';
import { playClick, playConfirm, playHover } from '../audio/soundEffects';

interface FnbItem {
  id: string;
  name: string;
  price: number;
  category: string;
  tag: string;
}

const MENU_ITEMS: FnbItem[] = [
  { id: '1', name: 'Monster Energy Ultra White', price: 150, category: 'DRINKS', tag: 'HIGH MARGIN (68%)' },
  { id: '2', name: 'Double Cheese Butter Maggi', price: 95, category: 'SNACKS', tag: 'BESTSELLER' },
  { id: '3', name: 'Peri Peri Crispy Nachos', price: 120, category: 'SNACKS', tag: 'KITCHEN READY' },
  { id: '4', name: 'Nitro Cold Brew Coffee (300ml)', price: 160, category: 'DRINKS', tag: 'ESPORTS BOOST' },
];

export const FnBMockup: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<{ [id: string]: number }>({ '1': 1, '2': 1 });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const addItem = (id: string) => {
    playClick();
    setSelectedItems(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeItem = (id: string) => {
    playClick();
    setSelectedItems(prev => {
      const copy = { ...prev };
      if (copy[id] > 1) {
        copy[id] -= 1;
      } else {
        delete copy[id];
      }
      return copy;
    });
  };

  const total = Object.entries(selectedItems).reduce((sum, [id, qty]) => {
    const item = MENU_ITEMS.find(m => m.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const handleOrder = () => {
    playConfirm();
    setOrderPlaced(true);
    setTimeout(() => {
      setOrderPlaced(false);
      setSelectedItems({});
    }, 3000);
  };

  return (
    <div className="bg-[#0B0D14] border border-white/15 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
      {/* OS Bar */}
      <div className="bg-[#12141F] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-arena-muted">
        <div className="flex items-center gap-2">
          <Utensils className="w-4 h-4 text-arena-lime" />
          <span className="text-white font-semibold">IN-SEAT STEAM-STYLE KIOSK // STATION RIG-09</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-arena-lime">KITCHEN KDS: DISPATCHED</span>
          <span className="text-arena-subtle">TABLE: VIP_ZONE</span>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-gradient-to-b from-[#0B0D14] to-[#07080C] min-h-[360px] flex flex-col justify-between">
        
        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Menu Items List */}
          <div className="md:col-span-7 space-y-2.5">
            <div className="text-[10px] text-arena-muted uppercase tracking-wider mb-2">
              SELECT ITEMS (DELIVERED DIRECTLY TO RIG-09)
            </div>

            {MENU_ITEMS.map(item => {
              const qty = selectedItems[item.id] || 0;
              return (
                <div
                  key={item.id}
                  className="p-3 bg-[#131520] border border-white/10 hover:border-arena-lime/50 rounded flex items-center justify-between transition-all"
                >
                  <div>
                    <div className="text-white font-bold">{item.name}</div>
                    <div className="flex items-center gap-2 text-[10px] text-arena-subtle mt-0.5">
                      <span className="text-arena-lime font-bold">₹{item.price}.00</span>
                      <span>·</span>
                      <span className="text-arena-muted">{item.tag}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {qty > 0 && (
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                    )}
                    {qty > 0 && <span className="text-white font-bold w-4 text-center">{qty}</span>}
                    <button
                      onClick={() => addItem(item.id)}
                      onMouseEnter={() => playHover()}
                      className="w-6 h-6 rounded bg-arena-lime text-black flex items-center justify-center font-bold hover:bg-arena-limeBright shadow-lime-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live In-Seat Order Cart & Kitchen Ticket */}
          <div className="md:col-span-5 bg-[#141624] border border-white/15 rounded-lg p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-3">
                <span className="text-white font-bold">RIG TICKET #418</span>
                <span className="text-arena-lime text-[10px] font-bold">AUTO-BILL TO WALLET</span>
              </div>

              {Object.keys(selectedItems).length === 0 ? (
                <div className="py-8 text-center text-arena-subtle text-[11px]">
                  No snacks in queue. Add items from the in-seat menu.
                </div>
              ) : (
                <div className="space-y-2 mb-4">
                  {Object.entries(selectedItems).map(([id, qty]) => {
                    const item = MENU_ITEMS.find(m => m.id === id);
                    if (!item) return null;
                    return (
                      <div key={id} className="flex justify-between text-[11px]">
                        <span className="text-arena-text">
                          {qty}x {item.name}
                        </span>
                        <span className="text-white font-bold">₹{item.price * qty}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <div className="pt-3 border-t border-white/10 flex justify-between items-center mb-4">
                <span className="text-arena-muted">ORDER TOTAL:</span>
                <span className="text-xl font-display font-black text-arena-lime">
                  ₹{total}.00
                </span>
              </div>

              <button
                onClick={handleOrder}
                disabled={total === 0 || orderPlaced}
                className={`w-full py-2.5 rounded font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  orderPlaced
                    ? 'bg-arena-lime text-black'
                    : total === 0
                    ? 'bg-white/10 text-arena-subtle cursor-not-allowed'
                    : 'bg-arena-lime text-black hover:bg-arena-limeBright shadow-lime-md'
                }`}
              >
                {orderPlaced ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>DISPATCHED TO KITCHEN SCREEN</span>
                  </>
                ) : (
                  <>
                    <BellRing className="w-4 h-4" />
                    <span>SEND ORDER TO PANTRY</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

        {/* Bottom Tag */}
        <div className="pt-4 border-t border-white/10 flex justify-between items-center text-[10px] text-arena-subtle">
          <div>ZERO GHOST SNACKS: KITCHEN PREP BARCODE LOCKED TO INVENTORY</div>
          <div className="text-arena-lime">AVERAGE IN-SEAT F&B LIFT: +34% PER GAMER</div>
        </div>

      </div>
    </div>
  );
};

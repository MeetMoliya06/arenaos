import React, { useState } from 'react';
import { Utensils, Check, BellRing } from 'lucide-react';
import { playClick, playConfirm, playHover } from '../audio/soundEffects';

interface FnbItem {
  id: string;
  name: string;
  price: number;
  category: string;
  tag: string;
}

const MENU_ITEMS: FnbItem[] = [
  { id: '1', name: 'Monster Energy Ultra White', price: 150, category: 'Drinks', tag: 'High margin (68%)' },
  { id: '2', name: 'Double Cheese Butter Maggi', price: 95, category: 'Snacks', tag: 'Bestseller' },
  { id: '3', name: 'Peri Peri Crispy Nachos', price: 120, category: 'Snacks', tag: 'Kitchen ready' },
  { id: '4', name: 'Nitro Cold Brew Coffee (300ml)', price: 160, category: 'Drinks', tag: 'Esports boost' },
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
    <div className="bg-[#111114] border border-white/10 rounded-xl overflow-hidden">
      {/* Top Bar */}
      <div className="bg-[#161619] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-sm text-arena-muted">
        <div className="flex items-center gap-2">
          <Utensils className="w-4 h-4 text-arena-lime" />
          <span className="text-white font-medium">In-seat kiosk · Rig 09</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-arena-lime">Kitchen: dispatched</span>
          <span className="text-arena-subtle">VIP zone</span>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-[#0D0D0F] min-h-[360px] flex flex-col justify-between">

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Menu Items List */}
          <div className="md:col-span-7 space-y-2.5">
            <div className="text-xs text-arena-muted mb-2">
              Select items, delivered directly to Rig 09
            </div>

            {MENU_ITEMS.map(item => {
              const qty = selectedItems[item.id] || 0;
              return (
                <div
                  key={item.id}
                  className="p-3 bg-white/[0.02] border border-white/10 hover:border-white/20 rounded-lg flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="text-white font-medium text-sm">{item.name}</div>
                    <div className="flex items-center gap-2 text-xs text-arena-subtle mt-0.5">
                      <span className="text-arena-lime">₹{item.price}.00</span>
                      <span>·</span>
                      <span>{item.tag}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {qty > 0 && (
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                      >
                        -
                      </button>
                    )}
                    {qty > 0 && <span className="text-white font-medium w-4 text-center text-sm">{qty}</span>}
                    <button
                      onClick={() => addItem(item.id)}
                      onMouseEnter={() => playHover()}
                      className="w-6 h-6 rounded bg-arena-lime text-black flex items-center justify-center hover:bg-arena-limeBright"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live In-Seat Order Cart & Kitchen Ticket */}
          <div className="md:col-span-5 bg-white/[0.03] border border-white/10 rounded-lg p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-3">
                <span className="text-white font-medium text-sm">Rig ticket #418</span>
                <span className="text-arena-lime text-xs">Auto-bill to wallet</span>
              </div>

              {Object.keys(selectedItems).length === 0 ? (
                <div className="py-8 text-center text-arena-subtle text-sm">
                  No snacks in queue. Add items from the in-seat menu.
                </div>
              ) : (
                <div className="space-y-2 mb-4">
                  {Object.entries(selectedItems).map(([id, qty]) => {
                    const item = MENU_ITEMS.find(m => m.id === id);
                    if (!item) return null;
                    return (
                      <div key={id} className="flex justify-between text-sm">
                        <span className="text-arena-text">
                          {qty}x {item.name}
                        </span>
                        <span className="text-white font-medium">₹{item.price * qty}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <div className="pt-3 border-t border-white/10 flex justify-between items-center mb-4">
                <span className="text-arena-muted text-sm">Order total</span>
                <span className="text-xl font-semibold text-arena-lime">
                  ₹{total}.00
                </span>
              </div>

              <button
                onClick={handleOrder}
                disabled={total === 0 || orderPlaced}
                className={`w-full py-2.5 rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                  orderPlaced
                    ? 'bg-arena-lime text-black'
                    : total === 0
                    ? 'bg-white/10 text-arena-subtle cursor-not-allowed'
                    : 'bg-arena-lime text-black hover:bg-arena-limeBright'
                }`}
              >
                {orderPlaced ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Dispatched to kitchen screen</span>
                  </>
                ) : (
                  <>
                    <BellRing className="w-4 h-4" />
                    <span>Send order to pantry</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

        {/* Bottom Tag */}
        <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs text-arena-subtle">
          <div>Zero ghost snacks — kitchen prep barcode locked to inventory</div>
          <div className="text-arena-lime">Average in-seat F&amp;B lift: +34%</div>
        </div>

      </div>
    </div>
  );
};

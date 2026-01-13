import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_BASE = "http://localhost:5000";

export default function App() {
  const [search, setSearch] = useState("");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [sort, setSort] = useState("relevance");
  const [platformFilter, setPlatformFilter] = useState("ALL");
  const [regionFilter, setRegionFilter] = useState("ALL");

  const [liked, setLiked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("likedGames")) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("likedGames", JSON.stringify(liked));
    } catch {}
  }, [liked]);

  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  async function fetchGames(q = "") {
    try {
      setLoading(true);
      setError("");

      const url = q
        ? `${API_BASE}/list?search=${encodeURIComponent(q)}`
        : `${API_BASE}/list`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      setGames(data);
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGames("");
  }, []);

  function onSubmit(e) {
    e.preventDefault();
    fetchGames(search);
  }

  const likedCount = useMemo(() => Object.keys(liked).length, [liked]);

  function toggleLike(id) {
    setLiked((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });
  }

  function addToCart(game) {
    setCart((prev) => {
      const next = { ...prev };
      const id = String(game.id);
      if (next[id]) next[id].qty += 1;
      else next[id] = { game, qty: 1 };
      return next;
    });
  }

  function incQty(id) {
    setCart((prev) => {
      const next = { ...prev };
      if (!next[id]) return next;
      next[id] = { ...next[id], qty: next[id].qty + 1 };
      return next;
    });
  }

  function decQty(id) {
    setCart((prev) => {
      const next = { ...prev };
      if (!next[id]) return next;

      const newQty = next[id].qty - 1;
      if (newQty <= 0) {
        delete next[id];
        return next;
      }

      next[id] = { ...next[id], qty: newQty };
      return next;
    });
  }

  function clearCart() {
    setCart({});
  }

  const cartCount = useMemo(
    () => Object.values(cart).reduce((s, i) => s + i.qty, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () =>
      Object.values(cart).reduce(
        (s, i) => s + Number(i.game.price) * i.qty,
        0
      ),
    [cart]
  );

  const visibleGames = useMemo(() => {
    let list = [...games];

    if (platformFilter !== "ALL") {
      list = list.filter(
        (g) => String(g.platform).toUpperCase() === platformFilter
      );
    }

    if (regionFilter !== "ALL") {
      list = list.filter(
        (g) => String(g.region).toUpperCase() === regionFilter
      );
    }

    list.sort((a, b) => {
      if (sort === "priceLow") return Number(a.price) - Number(b.price);
      if (sort === "priceHigh") return Number(b.price) - Number(a.price);
      return 0;
    });

    return list;
  }, [games, platformFilter, regionFilter, sort]);

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">eneba</div>

        <form className="search" onSubmit={onSubmit}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search games..."
          />
          <button type="submit">Search</button>
        </form>

        <div className="sortWrap">
          <select
            className="sortSelect"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            title="Sort"
          >
            <option value="relevance">Relevance</option>
            <option value="priceLow">Price: Low → High</option>
            <option value="priceHigh">Price: High → Low</option>
          </select>
        </div>

        <div className="actions">
          <button className="langBtn" type="button" title="Language / Currency">
            LT EN · EUR
          </button>

          <button className="iconBtn" type="button" title="Wishlist">
            ♡ <span className="tinyCount">{likedCount}</span>
          </button>

          <button
            className="iconBtn"
            type="button"
            title="Cart"
            onClick={() => setCartOpen((v) => !v)}
          >
            🛒 <span className="tinyCount">{cartCount}</span>
          </button>

          <button className="avatarBtn" type="button" title="Profile">
            👤
          </button>
        </div>

        {cartOpen && (
          <div className="cartDropdown">
            <div className="cartHeader">
              <strong>Cart</strong>
              <button className="linkBtn" type="button" onClick={clearCart}>
                Clear
              </button>
            </div>

            {cartCount === 0 ? (
              <p className="muted">Cart is empty.</p>
            ) : (
              <>
                <div className="cartList">
                  {Object.entries(cart).map(([id, item]) => (
                    <div className="cartRow" key={id}>
                      <div>
                        <div className="cartTitle">{item.game.name}</div>
                        <div className="cartMeta">
                          {item.game.platform} • {item.game.region}
                        </div>
                      </div>

                      <div className="cartRowRight">
                        <div className="cartPrice">
                          €{(Number(item.game.price) * item.qty).toFixed(2)}
                        </div>

                        <div className="qtyControls">
                          <button
                            className="qtyBtn"
                            type="button"
                            onClick={() => decQty(id)}
                          >
                            -
                          </button>
                          <span className="qty">{item.qty}</span>
                          <button
                            className="qtyBtn"
                            type="button"
                            onClick={() => incQty(id)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cartFooter">
                  <span className="cartTotal">Total: €{cartTotal.toFixed(2)}</span>
                </div>

                <button
                  className="checkoutBtn"
                  type="button"
                  onClick={() => alert("Demo only")}
                >
                  Checkout (demo)
                </button>
              </>
            )}
          </div>
        )}
      </header>

      <div className="filtersBar">
        {["ALL", "PC", "PS5", "XBOX", "NINTENDO"].map((p) => (
          <button
            key={p}
            type="button"
            className={`filterBtn ${platformFilter === p ? "active" : ""}`}
            onClick={() => setPlatformFilter(p)}
          >
            {p === "ALL" ? "All" : p}
          </button>
        ))}
      </div>

      <div className="filtersBar">
        {["ALL", "EUROPE", "GLOBAL"].map((r) => (
          <button
            key={r}
            type="button"
            className={`filterBtn ${regionFilter === r ? "active" : ""}`}
            onClick={() => setRegionFilter(r)}
          >
            {r === "ALL" ? "All regions" : r}
          </button>
        ))}
      </div>

      <main className="content">
        {loading && <div className="statusBox">Loading games...</div>}

        {!loading && error && (
          <div className="statusBox errorBox">
            <div className="statusTitle">Something went wrong</div>
            <div className="statusText">{error}</div>
          </div>
        )}

        {!loading && !error && visibleGames.length === 0 && (
          <div className="statusBox">
            <div className="statusTitle">No results found</div>
            <div className="statusText">
              Try a different search or clear filters.
            </div>
            <button
              className="retryBtn"
              type="button"
              onClick={() => {
                setSearch("");
                setPlatformFilter("ALL");
                setRegionFilter("ALL");
                fetchGames("");
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        {!loading && !error && visibleGames.length > 0 && (
          <div className="grid">
            {visibleGames.map((g) => (
              <div className="card" key={g.id}>
                <div className="imgWrap">
                  <img src={g.image_url} alt={g.name} />
                  <button
                    className={`likeOnCard ${liked[g.id] ? "liked" : ""}`}
                    type="button"
                    title="Add to wishlist"
                    onClick={() => toggleLike(g.id)}
                  >
                    {liked[g.id] ? "♥" : "♡"}
                  </button>
                </div>

                <div className="cardBody">
                  <div className="metaRow">
                    <span className="platformTag">{g.platform}</span>
                    <span className="regionTag">{g.region}</span>
                  </div>

                  <h3>{g.name}</h3>

                  <div className="priceRow">
                    <p className="price">€{Number(g.price).toFixed(2)}</p>

                    {g.old_price != null && Number(g.discount_pct) > 0 ? (
                      <>
                        <p className="oldPrice">
                          €{Number(g.old_price).toFixed(2)}
                        </p>
                        <span className="discountBadge">
                          -{Number(g.discount_pct)}%
                        </span>
                      </>
                    ) : null}
                  </div>

                  <button
                    className="addCartBtn"
                    type="button"
                    onClick={() => addToCart(g)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

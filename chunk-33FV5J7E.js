import{a as i,b as o,d as u,j as m}from"./chunk-YZJZGQXL.js";var n=class a{cartItemsSubject=new u([]);cartItems$=this.cartItemsSubject.asObservable();constructor(){let e=localStorage.getItem("cartItems");e&&this.cartItemsSubject.next(JSON.parse(e)),this.cartItemsSubject.subscribe(t=>{localStorage.setItem("cartItems",JSON.stringify(t))})}addToCart(e,t=1){let r=[...this.cartItemsSubject.value],c=r.findIndex(s=>s.product.id===e.id);c>-1?r[c]=o(i({},r[c]),{quantity:r[c].quantity+t}):r.push({product:e,quantity:t}),this.cartItemsSubject.next(r)}removeFromCart(e){let t=this.cartItemsSubject.value.filter(r=>r.product.id!==e);this.cartItemsSubject.next(t)}clearCart(){this.cartItemsSubject.next([]),localStorage.removeItem("cartItems")}updateCartItemQuantity(e,t){let r=[...this.cartItemsSubject.value],c=r.findIndex(s=>s.product.id===e);c>-1&&(t>0?r[c]=o(i({},r[c]),{quantity:t}):r.splice(c,1),this.cartItemsSubject.next(r))}getCartItemCount(){return this.cartItemsSubject.value.reduce((e,t)=>e+t.quantity,0)}getTotalCartValue(){return this.cartItemsSubject.value.reduce((e,t)=>e+t.product.price*t.quantity,0)}static \u0275fac=function(t){return new(t||a)};static \u0275prov=m({token:a,factory:a.\u0275fac,providedIn:"root"})};export{n as a};

(define-data-var listing-nonce uint u0)

(define-map store { id: uint } 
  { name: (string-utf8 50),
    description: (string-utf8 300),
    price: uint,
    stock: uint,
    owner: principal,
    timestamp: uint,
    url: (string-utf8 50)} )


(define-read-only (get-item (id uint))
  (let ((raw (unwrap! (map-get? store { id: id }) (err "Item not present!"))))
       (ok raw)))

(define-read-only (get-nonce) (var-get listing-nonce))

(define-public (remove-item (id uint)) 
  (let ((item (map-get? store {id: id})))
    (if (is-none item)
      (err "Item not present in store")
      (ok (map-delete store {id: id})))))

(define-public (add-item
    (name (string-utf8 50))
    (description (string-utf8 300))
    (price uint)
    (timestamp uint)
    (url (string-utf8 50)))
  (if (or (<= (len name) u0) (> (len name) u50))
      (err "Name must be between 1 and 50 characters long")
      (if (or (> (len description) u300))
        (err "Description must be less than or equal to 300 characters long")
        (if (or (<= price u0) (> price u1000000))
          (err "Price must be between 1 and 1,000,000")
          (if (<= timestamp u0) 
            (err "Timestamp must be greater than 0 and less than or equal to the current block height")
            (if (or (<= (len url) u0) (> (len url) u50))
              (err "URL must be between 1 and 50 characters long")
              (ok  
                (begin 
                  (var-set listing-nonce (+ (var-get listing-nonce) u1))
                  (map-set store {id: (var-get listing-nonce)} {name: name, description: description, price: price, stock: u1, owner: tx-sender, timestamp: timestamp, url: url})
                  (ok (var-get listing-nonce))
                 )
              )))))))

(define-public (purchase-item (id uint) (price uint)) 
  (let ((item (unwrap! (map-get? store { id: id }) (err "Item not present!"))))
    (let ((owner (get owner item))
          (item-price (get price item)))
      (if (>= price item-price)
        (let ((balance (stx-get-balance tx-sender)))
          (if (< balance price)
            (err "Insufficient balance to purchase item")
            (let ((tx-result (stx-transfer? price tx-sender owner)))
              (if (not (is-ok tx-result)) 
              (err "Payment transfer failed")
              (begin
                (map-set store { id: id } { name: (get name item), description: (get description item), price: item-price, stock: (get stock item), owner: tx-sender, timestamp: (get timestamp item), url: (get url item) })
                (ok "Item purchased successfully"))
              ))
            ))
          (err "Price is less than the item price")))))

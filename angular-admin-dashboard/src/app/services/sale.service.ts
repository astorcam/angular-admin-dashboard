import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, from, map, Observable, switchMap } from 'rxjs';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  
  private apiUrl = 'http://localhost:3000/sales';
  supabase: SupabaseClient;
 
  constructor(private http: HttpClient, private supabaseService: SupabaseService,private productService: ProductService) { 
    this.supabase = this.supabaseService.client;
  }
  
  getSales(){
        return from(this.supabase.from('sales').select('*').then(({ data }) => data ?? []));  
    }
getSalesWithNames() {
  return from(
    this.supabase
      .from('sales')
      .select(`
        *,
        products (name),
        buyers (name)
      `)
       .then(({ data }) =>
        (data ?? []).map(sale => {
          const { products, buyers, ...cleanSale } = sale;

          return {
            ...cleanSale,
            product: sale.products.name ?? '',
            client: sale.buyers.name ?? ''
          };
        })
      )
  );
}
 getProfit(): Observable<number> {
  return from(this.supabase.from('sales').select('total')).pipe(
    map(({ data, error }) => {
      if (error) {
        console.error('Error fetching sales:', error);
        return 0;
      }
      if (!data || data.length === 0) return 0;
      return data.reduce((acc: number, s: any) => acc + (s.total || 0), 0);
    })
  );
}
    
getAnualSales(): Observable<Record<number, number[]>> {
  return from(
    this.supabase.from('sales').select('date,quantity')
  ).pipe(
    map(({ data, error }) => {
      if (error) throw error;
      if (!data) return {};

      const salesByYear: Record<number, number[]> = {};
      data.forEach(sale => {
        const date = new Date(sale.date);
        const year = date.getFullYear();
        const month = date.getMonth();

        if (!salesByYear[year]) {
          salesByYear[year] = new Array(12).fill(0);
        }

        salesByYear[year][month] += sale.quantity;
      });

      return salesByYear;
    })
  );
}

getAnualProfits(): Observable<Record<number, number[]>> {
  return from(
    this.supabase.from('sales').select('date,total')
  ).pipe(
    map(({ data, error }) => {
      if (error) throw error;
      if (!data) return {};

      const profitsByYear: Record<number, number[]> = {};

      data.forEach(sale => {
        const date = new Date(sale.date);
        const year = date.getFullYear();
        const month = date.getMonth();

        if (!profitsByYear[year]) {
          profitsByYear[year] = new Array(12).fill(0);
        }

        profitsByYear[year][month] += sale.total;
      });

      return profitsByYear;
    })
  );
}

getBestSeller() {
  return from(
    this.supabase
      .from('sales')
      .select('*')
  ).pipe(
    map(({ data, error }) => {
      if (error) {
        console.error('Error fetching sales:', error);
        return null;
      }
      if (!data || data.length === 0) return null;

      // Filtramos solo ventas completadas
      const completed = data.filter(s => s.status === 'Completed');

      // Agrupamos por producto
      const hashTotals: Record<number, number> = {};
      completed.forEach(sale => {
        const pid = sale.product_id; // 👈 usa el nombre real de la columna
        hashTotals[pid] = (hashTotals[pid] || 0) + sale.quantity;
      });

      // Buscamos el más vendido
      let bestSellerId: number | null = null;
      let maxQty = 0;
      for (const productId in hashTotals) {
        if (hashTotals[productId] > maxQty) {
          maxQty = hashTotals[productId];
          bestSellerId = +productId;
        }
      }

      return { productId: bestSellerId, totalSold: maxQty };
    })
  );
}
 getWorstSeller() {
  return from(
    this.supabase
      .from('sales')
      .select('*')
  ).pipe(
    map(({ data, error }) => {
      if (error) {
        console.error('Error fetching sales:', error);
        return null;
      }
      if (!data || data.length === 0) return null;

      // Filtramos solo ventas completadas
      const completed = data.filter(s => s.status === 'Completed');
      if (completed.length === 0) return null;

      // Agrupamos por producto
      const hashTotals: Record<number, number> = {};
      completed.forEach(sale => {
        const pid = sale.product_id; 
        hashTotals[pid] = (hashTotals[pid] || 0) + sale.quantity;
      });

      // Encontramos el producto con menor cantidad vendida
      let worstSellerId: number | null = null;
      let minQty = Infinity;

      for (const productId in hashTotals) {
        const qty = hashTotals[productId];
        if (qty < minQty) {
          minQty = qty;
          worstSellerId = +productId;
        }
      }

      if (worstSellerId === null) return null;
      return { productId: worstSellerId, totalSold: minQty };
    })
  );
}

  getAnualSalesPerProduct() {
  return from(
    this.supabase.from('sales').select('*')
  ).pipe(
    map(({ data, error }) => {
      if (error) {
        console.error('Error fetching sales:', error);
        return null;
      }
      if (!data || data.length === 0) return null;

      // Filtramos solo ventas completadas
      const completed = data.filter(s => s.status === 'Completed');
      if (completed.length === 0) return null;

      const productsSales: { [key: number]: number[] } = {}; 

      completed.forEach(sale => {
        const productId = sale.product_id; 
        const month = new Date(sale.date).getMonth(); 

        if (!productsSales[productId]) {
          productsSales[productId] = new Array(12).fill(0);
        }

        productsSales[productId][month] += sale.total; 
      });

      return productsSales;
    })
  );
}


  getTopProductsOfYear() {
  return from(
    this.supabase
      .from('sales')
      .select('*')
  ).pipe(
    map(({ data, error }) => {
      if (error) {
        console.error('Error fetching sales:', error);
        return [];
      }
      if (!data) return [];

      const totalsByProduct: Record<number, number> = {};

      data.forEach(sale => {
        // Sumamos la cantidad total por producto en el año
        totalsByProduct[sale.product_id] =
          (totalsByProduct[sale.product_id] || 0) + sale.quantity;
      });

      // Convertimos a array y ordenamos
      const sorted = Object.entries(totalsByProduct)
        .map(([productId, quantity]) => ({ productId: +productId, quantity }))
        .sort((a, b) => b.quantity - a.quantity);

      // Retornar los 5 mejores
      return sorted.slice(0, 5);
    })
  );
}
getMostSalesCategory(): Observable<{ category: string, totalSales: number }> {
  return from(this.supabase.from('sales').select('*')).pipe(
    map(({ data, error }) => {
      if (error) throw error;
      if (!data) return { category: '', totalSales: 0 };

      const completed = data.filter(s => s.status === 'Completed');
      const productSales: Record<number, number> = {};

      completed.forEach(s => {
        productSales[s.product_id] = (productSales[s.product_id] || 0) + s.quantity;
      });

      return productSales;
    }),
    switchMap(productSales  => {
      const ps = productSales as Record<number, number>;
      const requests = Object.keys(productSales).map(id =>
        this.productService.getProductById(Number(id)).pipe(
          map(product => ({ category: product.category, qty: ps[Number(id)] }))
        )
      );
      return forkJoin(requests);
    }),
    map(results => {
      const salesCategories: Record<string, number> = {};
      results.forEach(r => {
        salesCategories[r.category] = (salesCategories[r.category] || 0) + r.qty;
      });

      let mostCategory = '';
      let maxQty = 0;
      for (const category in salesCategories) {
        if (salesCategories[category] > maxQty) {
          mostCategory = category;
          maxQty = salesCategories[category];
        }
      }
      return { category: mostCategory, totalSales: maxQty };
    })
  );
}

getProductSalesBarChartData(): Observable<{ labels: string[], data: number[] }> {
  return from(this.supabase.from('sales').select('*')).pipe(
    map(({ data, error }) => {
      if (error) throw error;
      const completed = data?.filter(s => s.status === 'Completed') ?? [];
      const productSales: Record<number, number> = {};
      completed.forEach(sale => {
        productSales[sale.product_id] = (productSales[sale.product_id] || 0) + sale.quantity;
      });
      return productSales;
    }),
    switchMap(productSales => {
      const requests = Object.keys(productSales).map(id =>
        this.productService.getProductById(Number(id)).pipe(
          map(product => ({
            name: product.name,
            qty: productSales[Number(id)]
          }))
        )
      );
      return forkJoin(requests);
    }),
    map(mappedProducts => ({
      labels: mappedProducts.map(p => p.name),
      data: mappedProducts.map(p => p.qty)
    }))
  );
}

 getSalesByCategory(): Observable<{ [category: string]: number }> {
  return this.getSales().pipe(
    switchMap(sales => {
      const completed = sales.filter(s => s.status === 'Completed');
      const productSales: { [key: number]: number } = {};

      completed.forEach(sale => {
        if (!productSales[sale.product_id]) productSales[sale.product_id] = 0;
        productSales[sale.product_id] += sale.quantity;
      });

      const requests = Object.keys(productSales).map(id =>
        this.productService.getProductById(Number(id)).pipe(
          map(product => ({ category: product.category, qty: productSales[Number(id)] }))
        )
      );
      return forkJoin(requests).pipe(
        map(results => {
          const salesCategories: { [key: string]: number } = {};
          results.forEach(r => {
            salesCategories[r.category] = (salesCategories[r.category] || 0) + r.qty;
          });
          return salesCategories;
        })
      );
    })
  );
}

  addSale(sale: any, userId: string) {
  
    console.log('Sale agregada:', sale, userId);
  return from(this.supabase.from('sales').insert([{ ...sale, admin_id: userId }]));
}

deleteSale(saleRow: any, userId: string) {
    console.log('Sale borrado:', saleRow, userId);
    return from(
      this.supabase
      .from('sales')
      .delete()
      .match({ id: saleRow.id, admin_id: userId })
    );
  }

    editSale(editedSale: any, admin_id: string) {
    console.log('Sale editado:', editedSale, admin_id);
    return from(
    this.supabase
      .from('sales')
      .update({
        quantity: editedSale.quantity, 
        total: editedSale.total, 
        date: editedSale.date,
        status: editedSale.status
      })
      .eq('id', editedSale.id)         // ← identificar por ID
      .eq('admin_id', admin_id)          // ← asegurar que sea del admin
  ); 
}
}


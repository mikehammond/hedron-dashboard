import { NextPage } from "next";
import { useQuery, useMutation } from "@apollo/client";

import withDefaultLayout from "../../../layouts/DefaultLayout";

import { GET_PRODUCTS } from "../../../graphql/queries";
import { ARCHIVE_PRODUCT, RESTORE_PRODUCT } from "../../../graphql/mutations";

import { NextPageProps } from '../../../utils/PropTypes';
import { ProductType, ProductFilter } from "../../../utils/interfaces";

import ProductCardItem from '../../../components/ProductCardItem';
import Filter from "../../../components/Filter";

const ProductsIndex: NextPage<NextPageProps> = ({ user }) => {
  const { loading, error, data } = useQuery<{ products: ProductType[] }, ProductFilter>(
    GET_PRODUCTS,
    { variables: { userId: user.sub }, pollInterval: 1000 }
  );

  const [archiveProduct] = useMutation<{ product: ProductType }, { productId: string }>(ARCHIVE_PRODUCT);
  const [restoreProduct] = useMutation<{ product: ProductType }, { productId: string }>(RESTORE_PRODUCT);

  if (loading) {
    return (
      <div className="pageloader is-active is-bottom-to-top">
        <span className="title">Retrieving Your Products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pageloader has-background-danger is-active is-bottom-to-top">
        <span className="title">{error.message}</span>
      </div>
    );
  }

  return (
    <section className="section">
      <section className="section">
        <h1 className="title">Products</h1>
        <Filter />
      </section>
      <section className="section">
        <div className="columns is-multiline">
          {data.products.map(product => (
            <ProductCardItem
              key={product._id}
              product={product}
              hasVendorActions={true}
              onArchive={(productId: string) => {
                archiveProduct({
                  variables: { productId },
                  refetchQueries: [ { query: GET_PRODUCTS, variables: { userId: user.sub } } ]
                });
              }}
              onRestore={(productId: string) => {
                restoreProduct({
                  variables: { productId },
                  refetchQueries: [ { query: GET_PRODUCTS, variables: { userId: user.sub } } ]
                });
              }}
            />
          ))}
        </div>
      </section>
    </section>
  );
}

export default withDefaultLayout(ProductsIndex);
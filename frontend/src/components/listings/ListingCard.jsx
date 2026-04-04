import { Link } from 'react-router-dom';
import { formatPrice, timeAgo, conditionLabels, getConditionColor, getAvatarUrl, truncate } from '../../utils/helpers';

const ListingCard = ({ listing }) => {
  const { _id, title, price, condition, category, images, seller, status, createdAt } = listing;

  return (
    <article className="card-hover group">
      {/* Image */}
      <Link to={`/listing/${_id}`} className="block relative overflow-hidden h-48 bg-dark-800">
        {images?.[0]?.url ? (
          <img
            src={images[0].url}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-dark-600">📷</div>
        )}
        {/* Status badge */}
        {status === 'sold' && (
          <div className="absolute inset-0 bg-dark-950/70 flex items-center justify-center">
            <span className="badge bg-danger/90 text-white text-sm px-3 py-1">SOLD</span>
          </div>
        )}
        {/* Condition badge */}
        <div className="absolute top-2 right-2">
          <span className={`badge bg-dark-900/90 ${getConditionColor(condition)} text-xs`}>
            {conditionLabels[condition]}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/listing/${_id}`} className="block mb-2">
          <h3 className="font-semibold text-white font-display hover:text-primary-400 transition-colors line-clamp-2 text-sm leading-tight">
            {truncate(title, 80)}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-3">
          <span className="text-primary-400 font-bold font-display text-lg">{formatPrice(price)}</span>
          <span className="text-xs text-dark-400">{timeAgo(createdAt)}</span>
        </div>

        {/* Seller */}
        <div className="flex items-center gap-2 pt-3 border-t border-dark-700">
          <img
            src={getAvatarUrl(seller?.avatar, seller?.name)}
            alt={seller?.name}
            className="w-6 h-6 rounded-full"
          />
          <Link to={`/profile/${seller?._id}`} className="text-xs text-dark-300 hover:text-primary-400 transition-colors truncate">
            {seller?.name}
          </Link>
          {seller?.isOnline && (
            <span className="w-2 h-2 bg-success rounded-full ml-auto flex-shrink-0" title="Online" />
          )}
        </div>
      </div>
    </article>
  );
};

export default ListingCard;